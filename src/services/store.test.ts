import { configureStore } from '@reduxjs/toolkit';
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

describe('Тестирование rootReducer', () => {
  it('должен инициализироваться с корректным начальным состоянием', () => {
    // Создаем store с rootReducer
    const store = configureStore({
      reducer: rootReducer
    });

    // Получаем начальное состояние
    const state = store.getState();

    // Проверяем, что все ключи присутствуют
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerBuilder');
    expect(state).toHaveProperty('feed');
  });

  it('должен вернуть корректное начальное состояние для user', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.user).toEqual({
      isAuthChecked: false,
      user: null,
      error: undefined
    });
  });

  it('должен вернуть корректное начальное состояние для ingredients', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: undefined
    });
  });

  it('должен вернуть корректное начальное состояние для burgerBuilder', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.burgerBuilder).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: undefined
    });
  });

  it('должен вернуть корректное начальное состояние для feed', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.feed).toEqual({
      orders: [],
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      loading: false,
      error: undefined
    });
  });

  it('должен корректно обработать неизвестный экшен', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const initialState = store.getState();

    // Диспатчим неизвестный экшен
    store.dispatch({ type: 'UNKNOWN_ACTION' });

    const newState = store.getState();

    // Состояние не должно измениться
    expect(newState).toEqual(initialState);
  });
});

