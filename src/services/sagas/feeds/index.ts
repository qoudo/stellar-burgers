import { call, put } from 'redux-saga/effects';
import { getFeedsApi, TFeedsResponse } from '@api';
import { FeedsSlice } from '../../slices/feeds';

export function* fetchFeeds() {
  try {
    const data: TFeedsResponse = yield call(getFeedsApi);
    yield put(FeedsSlice.actions.success(data));
  } catch (error) {
    yield put(FeedsSlice.actions.failure(error));
  }
}
