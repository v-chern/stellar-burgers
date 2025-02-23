import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TLoginData, loginUserApi, TRegisterData, registerUserApi } from '@api';
import { TUser } from '@utils-types';

export const loginUser = createAsyncThunk(
  'users/login',
  async ({ email, password }: TLoginData) => {
    const res = await loginUserApi({ email, password });
    console.log('response', res);
    return res;
  }
);

export const registerUser = createAsyncThunk(
  'users/reguster',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    console.log('response', res);
    return res;
  }
);

interface UserState {
  user: TUser | null;
  isInit: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isInit: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        console.log(action);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
      });
  }
});

export const { selectUser } = userSlice.selectors;
export default userSlice.reducer;
