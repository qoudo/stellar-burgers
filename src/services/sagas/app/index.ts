import { put } from 'redux-saga/effects';
import { IngredientsSlice } from '../../slices/indredients';
import { FeedsSlice } from '../../slices/feeds';
import { OrdersSlice } from '../../slices/orders';
import { UserSlice } from '../../slices/user';

export function* init() {
  yield put(IngredientsSlice.actions.request());
  yield put(FeedsSlice.actions.request());
  yield put(OrdersSlice.actions.request());
  yield put(UserSlice.actions.request());
}
