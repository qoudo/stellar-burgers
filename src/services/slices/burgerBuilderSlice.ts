import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TIngredient, TOrder } from '../../utils/types';
import { nanoid } from '@reduxjs/toolkit';

export interface TConstructorIngredient extends TIngredient {
  id: string;
}

export interface TBurgerBuilderState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | undefined;
}

export const initialState: TBurgerBuilderState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: undefined
};

export const orderBurger = createAsyncThunk(
  'burgerBuilder/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

const burgerBuilderSlice = createSlice({
  name: 'burgerBuilder',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragIngredient = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragIngredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = undefined;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // Очищаем конструктор при успешном заказе
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} = burgerBuilderSlice.actions;

export default burgerBuilderSlice.reducer;
