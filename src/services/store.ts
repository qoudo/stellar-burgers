import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootSaga } from './sagas';
import { IngredientsSlice } from './slices/indredients';

const rootReducer = {
  ingredients: IngredientsSlice.reducer
}; // Заменить на импорт настоящего редьюсера

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

sagaMiddleware.run(rootSaga);

const combined = combineReducers(rootReducer);

export type RootState = ReturnType<typeof combined>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
