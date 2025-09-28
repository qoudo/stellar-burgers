import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
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

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0]; // API возвращает массив с одним заказом
  }
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
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        // Добавляем заказ в orders если его там еще нет
        const existingOrder = state.orders.find(
          (order) => order.number === action.payload.number
        );
        if (!existingOrder) {
          state.orders.push(action.payload);
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default feedSlice.reducer;
