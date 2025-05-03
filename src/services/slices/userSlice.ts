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
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  user: TUser;
  orders: TOrder[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  user: {
    name: '',
    email: ''
  },
  orders: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'users/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    return res;
  }
);

export const registerUser = createAsyncThunk(
  'users/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    return res;
  }
);

export const getUser = createAsyncThunk('users/get', async () => {
  const res = await getUserApi();
  return res;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res;
  }
);

export const logoutUser = createAsyncThunk('users/logout', async () => {
  const res = await logoutApi();
  return res;
});

export const getUserOrders = createAsyncThunk('users/orders', async () => {
  const res = await getOrdersApi();
  return res;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsLoading: (state) => state.isLoading,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectError: (state) => state.error || '',
    selectUserOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      //Логин пользователя
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
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
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      //Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      //Получение заказов пользователя
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      //Выход пользователя
      .addCase(logoutUser.pending, (state) => {
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
        deleteCookie('accessToken');
        localStorage.clear();
      });
  }
});

export const { clearUserOrders } = userSlice.actions;

export const {
  selectUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectUserOrders
} = userSlice.selectors;

export default userSlice.reducer;
