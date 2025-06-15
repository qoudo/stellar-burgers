import { call, put } from 'redux-saga/effects';
import { getIngredientsApi, TIngredientsResponse } from '@api';
import { IngredientsSlice } from '../../slices/indredients';

export function* fetchIngredients() {
  try {
    const data: TIngredientsResponse['data'] = yield call(getIngredientsApi);
    yield put(IngredientsSlice.actions.success(data));
  } catch (error) {
    yield put(IngredientsSlice.actions.failure(error));
  }
}
