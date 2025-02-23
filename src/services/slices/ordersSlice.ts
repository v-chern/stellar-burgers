//TODO: Orders относятся к пользователю.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (err) {
    console.log(err);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        //state.orders = action.payload;
      });
  }
});

export const { selectOrders } = ordersSlice.selectors;
export default ordersSlice.reducer;
