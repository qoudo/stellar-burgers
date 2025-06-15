import { call, put } from 'redux-saga/effects';
import { getUserApi } from '@api';
import { UserSlice } from '../../slices/user';
import { TUser } from '@utils-types';

export function* fetchUser() {
  try {
    const data: TUser = yield call(getUserApi);
    yield put(UserSlice.actions.success(data));
  } catch (error) {
    yield put(UserSlice.actions.failure(error));
  }
}
