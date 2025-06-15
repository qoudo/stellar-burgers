import { createSlice } from '@reduxjs/toolkit';
import {
  createRemoteDataReducers,
  RemoteDataState
} from '../remote-data-reducers';
import { STATUS } from '../../../constants';
import { TFeedsResponse } from '@api';

type FeedsState = RemoteDataState<TFeedsResponse | null, unknown>;

const initialState: FeedsState = {
  data: null,
  error: null,
  status: STATUS.initial
};

export const FeedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    ...createRemoteDataReducers<FeedsState>(initialState)
  },
  selectors: {
    getData: (sliceState) => sliceState.data,
    isFetching: (sliceState) => sliceState.status === STATUS.fetching
  }
});
