import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface TFeedState {
  orders: TOrder[];
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  loading: boolean;
  error: string | undefined;
}

export const initialState: TFeedState = {
  orders: [],
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: undefined
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const getOrders = createAsyncThunk(
  'feed/getOrders',
  async () => await getOrdersApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feed.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default feedSlice.reducer;
