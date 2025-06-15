import { put } from 'redux-saga/effects';
import { IngredientsSlice } from '../../slices/indredients';

export function* init() {
  yield put(IngredientsSlice.actions.request());
}
