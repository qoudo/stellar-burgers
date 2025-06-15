import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import {
  createRemoteDataReducers,
  RemoteDataState
} from '../remote-data-reducers';

type IngredientState = RemoteDataState<TIngredient[] | null, unknown>;

const initialState: IngredientState = {
  data: null,
  error: null,
  status: 'initial'
};

export const IngredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    ...createRemoteDataReducers<IngredientState>(initialState)
  },
  selectors: {
    getData: (sliceState) => sliceState.data
  }
});
