import { PayloadAction } from '@reduxjs/toolkit';
import { IStatus } from '@utils-types';

export interface RemoteDataState<TData, TError> {
  data: TData;
  error: TError | null;
  status: keyof typeof IStatus;
}

// eslint-disable-next-line require-jsdoc
export const createRemoteDataReducers = <S extends RemoteDataState<any, any>>(
  initialState: S
) => ({
  request: (state: S) => {
    state.status = IStatus.fetching;
  },
  success: (state: S, action: PayloadAction<S['data']>) => {
    state.data = action.payload;
    state.status = IStatus.success;
    state.error = null;
  },
  failure: (state: S, action: PayloadAction<S['error']>) => {
    state.error = action.payload;
    state.status = IStatus.failure;
  },
  reset: () => initialState
});
