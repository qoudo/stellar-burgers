import { createSlice } from '@reduxjs/toolkit';
import {
  createRemoteDataReducers,
  RemoteDataState
} from '../remote-data-reducers';
import { STATUS } from '../../../constants';
import { TOrder } from '@utils-types';

type OrdersState = RemoteDataState<TOrder[] | null, unknown>;

const initialState: OrdersState = {
  data: [],
  error: null,
  status: STATUS.initial
};

export const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    ...createRemoteDataReducers<OrdersState>(initialState)
  },
  selectors: {
    getData: (sliceState) => sliceState.data,
    isFetching: (sliceState) => sliceState.status === STATUS.fetching
  }
});
