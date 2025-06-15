import { PayloadAction } from '@reduxjs/toolkit';
import { STATUS } from '../../constants';

export interface RemoteDataState<TData, TError> {
  data: TData;
  error: TError | null;
  status: keyof typeof STATUS;
}

// eslint-disable-next-line require-jsdoc
export const createRemoteDataReducers = <S extends RemoteDataState<any, any>>(
  initialState: S
) => ({
  request: (state: S) => {
    state.status = STATUS.fetching;
  },
  success: (state: S, action: PayloadAction<S['data']>) => {
    state.data = action.payload;
    state.status = STATUS.success;
    state.error = null;
  },
  failure: (state: S, action: PayloadAction<S['error']>) => {
    state.error = action.payload;
    state.status = STATUS.failure;
  },
  reset: () => initialState
});
