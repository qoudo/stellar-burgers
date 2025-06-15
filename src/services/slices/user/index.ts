import { createSlice } from '@reduxjs/toolkit';
import {
  createRemoteDataReducers,
  RemoteDataState
} from '../remote-data-reducers';
import { STATUS } from '../../../constants';
import { TUser } from '@utils-types';

type UserState = RemoteDataState<TUser | null, unknown>;

const initialState: UserState = {
  data: null,
  error: null,
  status: STATUS.initial
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    ...createRemoteDataReducers<UserState>(initialState)
  },
  selectors: {
    getData: (sliceState) => sliceState.data,
    isFetching: (sliceState) => sliceState.status === STATUS.fetching
  }
});
