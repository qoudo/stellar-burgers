import { takeEvery, call } from 'redux-saga/effects';
import { IngredientsSlice } from '../slices/indredients';
import { fetchIngredients } from './ingredients';
import { init } from './app';
import { FeedsSlice } from '../slices/feeds';
import { fetchFeeds } from './feeds';
import { OrdersSlice } from '../slices/orders';
import { fetchOrders } from './orders';
import { UserSlice } from '../slices/user';
import { fetchUser } from './user';

export function* rootSaga() {
  yield takeEvery(IngredientsSlice.actions.request, fetchIngredients);
  yield takeEvery(FeedsSlice.actions.request, fetchFeeds);
  yield takeEvery(OrdersSlice.actions.request, fetchOrders);
  yield takeEvery(UserSlice.actions.request, fetchUser);

  yield call(init);
}
