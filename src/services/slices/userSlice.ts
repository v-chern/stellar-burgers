import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  loginUserApi,
  TRegisterData,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  getOrdersApi
} from '@api';
import { TOrder, TUser } from '@utils-types';
import { getCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser;
  orders: TOrder[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  user: {
    name: '',
    email: ''
  },
  orders: [],
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'users/login',
  async (data: TLoginData, { rejectWithValue }) => {
    const res = await loginUserApi(data);
    console.log('Login response', res);
    return res;
  }
);

export const registerUser = createAsyncThunk(
  'users/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    console.log('Register response', res);
    return res;
  }
);

export const getUser = createAsyncThunk('users/get', async () => {
  const res = await getUserApi();
  console.log('get user response', res);
  return res;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    console.log('update user response', res);
    return res;
  }
);

export const logoutUser = createAsyncThunk('users/logout', async () => {
  const res = await logoutApi();
  console.log('logout response', res);
  return res;
});

export const getUserOrders = createAsyncThunk('users/orders', async () => {
  const res = await getOrdersApi();
  console.log('get orders response', res);
  return res;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsLoading: (state) => state.isLoading,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectError: (state) => state.error || '',
    selectOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      //Логин пользователя
      .addCase(loginUser.pending, (state) => {
        console.log('login pending');
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('login fulfilled');
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      //Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      //Получение данных пользователя
      .addCase(getUser.pending, (state) => {
        console.log('get user pending');
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        console.log('get user fulfilled');
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      //Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        console.log('update user pending');
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log('update user fulfilled');
        state.isLoading = false;
        //state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      //Получение заказов пользователя
      .addCase(getUserOrders.pending, (state) => {
        console.log('get user orders pending');
        state.isLoading = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        console.log('get user orders fulfilled');
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      //Выход пользователя
      .addCase(logoutUser.pending, (state) => {
        console.log('logout pending');
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = {
          name: '',
          email: ''
        };
        state.error = null;
        setCookie('accessToken', '', { expires: -1 });
        localStorage.clear();
        console.log('logout fulfilled');
      });
  }
});

export const {
  selectUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectOrders
} = userSlice.selectors;
export default userSlice.reducer;
