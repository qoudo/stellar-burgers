import ingredientsReducer, {
  initialState,
  getIngredients
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('Тестирование ingredientsSlice', () => {
  // Тестовые данные
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Тестовая булка',
      type: 'bun',
      proteins: 50,
      fat: 20,
      carbohydrates: 30,
      calories: 400,
      price: 100,
      image: 'test.png',
      image_mobile: 'test-mobile.png',
      image_large: 'test-large.png'
    },
    {
      _id: '2',
      name: 'Тестовая начинка',
      type: 'main',
      proteins: 40,
      fat: 15,
      carbohydrates: 25,
      calories: 350,
      price: 200,
      image: 'test.png',
      image_mobile: 'test-mobile.png',
      image_large: 'test-large.png'
    }
  ];

  describe('Начальное состояние', () => {
    it('должно быть корректным', () => {
      expect(initialState).toEqual({
        ingredients: [],
        loading: false,
        error: undefined
      });
    });
  });

  describe('Асинхронный экшен getIngredients', () => {
    it('должен установить loading в true при pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен установить loading в false при pending и очистить предыдущую ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const action = { type: getIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить ингредиенты и установить loading в false при fulfilled', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
      expect(state.error).toBeUndefined();
    });

    it('должен заменить старые ингредиенты новыми при fulfilled', () => {
      const oldIngredients: TIngredient[] = [
        {
          _id: '10',
          name: 'Старая булка',
          type: 'bun',
          proteins: 30,
          fat: 10,
          carbohydrates: 20,
          calories: 300,
          price: 50,
          image: 'old.png',
          image_mobile: 'old-mobile.png',
          image_large: 'old-large.png'
        }
      ];

      const stateWithOldIngredients = {
        ...initialState,
        ingredients: oldIngredients
      };

      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = ingredientsReducer(stateWithOldIngredients, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен сохранить ошибку и установить loading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';

      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    it('должен сохранить старые ингредиенты при ошибке загрузки', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredients
      };

      const errorMessage = 'Сетевая ошибка';

      const action = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('Последовательность вызовов', () => {
    it('должен корректно обработать последовательность pending -> fulfilled', () => {
      let state = ingredientsReducer(initialState, {
        type: getIngredients.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();

      state = ingredientsReducer(state, {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      });

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeUndefined();
    });

    it('должен корректно обработать последовательность pending -> rejected', () => {
      let state = ingredientsReducer(initialState, {
        type: getIngredients.pending.type
      });

      expect(state.loading).toBe(true);

      const errorMessage = 'Ошибка сервера';
      state = ingredientsReducer(state, {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен корректно обработать повторную загрузку после ошибки', () => {
      // Первая попытка с ошибкой
      let state = ingredientsReducer(initialState, {
        type: getIngredients.pending.type
      });

      state = ingredientsReducer(state, {
        type: getIngredients.rejected.type,
        error: { message: 'Первая ошибка' }
      });

      expect(state.error).toBe('Первая ошибка');

      // Вторая попытка успешная
      state = ingredientsReducer(state, { type: getIngredients.pending.type });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();

      state = ingredientsReducer(state, {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      });

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeUndefined();
    });
  });
});
