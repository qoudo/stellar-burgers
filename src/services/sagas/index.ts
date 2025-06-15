import { takeEvery, call } from 'redux-saga/effects';
import { IngredientsSlice } from '../slices/indredients';
import { fetchIngredients } from './ingredients';
import { init } from './app';

export function* rootSaga() {
  yield takeEvery(IngredientsSlice.actions.request, fetchIngredients);

  yield call(init);
}
