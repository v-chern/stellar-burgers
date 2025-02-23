import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

interface FeedState {
  feed: TOrdersData;
  loading: boolean;
  error: string | null | undefined;
}

const initialState: FeedState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const fetchFeedOrders = createAsyncThunk('feed/fetchAll', async () => {
  const data = await getFeedsApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedOrders: (state) => state.feed.orders,
    selectFeedTotal: (state) => state.feed.total,
    selectFeedTotalToday: (state) => state.feed.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      });
  }
});

export const { selectFeedOrders, selectFeedTotal, selectFeedTotalToday } =
  feedSlice.selectors;
export default feedSlice.reducer;
