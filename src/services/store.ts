import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerBuilderReducer from './slices/burgerBuilderSlice';
import feedReducer from './slices/feedSlice';

const rootReducer = {
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerBuilder: burgerBuilderReducer,
  feed: feedReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
