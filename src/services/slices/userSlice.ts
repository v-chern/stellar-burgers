import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  loginUserApi,
  TRegisterData,
  registerUserApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { TUser } from '@utils-types';
import { getCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  user: {
    name: '',
    email: ''
  },
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

export const logoutUser = createAsyncThunk('users/logout', async () => {
  const res = await logoutApi();
  console.log('logout response', res);
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
    selectError: (state) => state.error || ''
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
        state = initialState;
      });
  }
});

export const {
  selectUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading
} = userSlice.selectors;
export default userSlice.reducer;
