import { call, put } from 'redux-saga/effects';
import { getOrdersApi } from '@api';
import { OrdersSlice } from '../../slices/orders';
import { TOrder } from '@utils-types';

export function* fetchOrders() {
  try {
    const data: TOrder[] = yield call(getOrdersApi);
    yield put(OrdersSlice.actions.success(data));
  } catch (error) {
    yield put(OrdersSlice.actions.failure(error));
  }
}
