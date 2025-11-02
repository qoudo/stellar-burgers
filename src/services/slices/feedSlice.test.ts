import feedReducer, {
  initialState,
  getFeeds,
  getOrders,
  getOrderByNumber
} from './feedSlice';
import { TOrder } from '../../utils/types';

describe('Тестирование feedSlice', () => {
  // Тестовые данные
  const mockOrder1: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Тестовый бургер 1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1001,
    ingredients: ['ingredient1', 'ingredient2']
  };

  const mockOrder2: TOrder = {
    _id: '2',
    status: 'pending',
    name: 'Тестовый бургер 2',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02',
    number: 1002,
    ingredients: ['ingredient3', 'ingredient4']
  };

  const mockFeedData = {
    orders: [mockOrder1, mockOrder2],
    total: 100,
    totalToday: 10
  };

  describe('Начальное состояние', () => {
    it('должно быть корректным', () => {
      expect(initialState).toEqual({
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
  });

  describe('Асинхронный экшен getFeeds', () => {
    it('должен установить loading в true при pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить данные ленты и установить loading в false при fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedData
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.feed.orders).toEqual(mockFeedData.orders);
      expect(state.feed.total).toBe(100);
      expect(state.feed.totalToday).toBe(10);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить ошибку и установить loading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты';

      const action = {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('Асинхронный экшен getOrders', () => {
    it('должен установить loading в true при pending', () => {
      const action = { type: getOrders.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить заказы пользователя и установить loading в false при fulfilled', () => {
      const userOrders = [mockOrder1, mockOrder2];

      const action = {
        type: getOrders.fulfilled.type,
        payload: userOrders
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(userOrders);
      expect(state.orders).toHaveLength(2);
      expect(state.error).toBeUndefined();
    });

    it('должен заменить старые заказы новыми при fulfilled', () => {
      const oldOrder: TOrder = {
        _id: '10',
        status: 'done',
        name: 'Старый бургер',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01',
        number: 100,
        ingredients: ['old1']
      };

      const stateWithOldOrders = {
        ...initialState,
        orders: [oldOrder]
      };

      const action = {
        type: getOrders.fulfilled.type,
        payload: [mockOrder1]
      };

      const state = feedReducer(stateWithOldOrders, action);

      expect(state.orders).toEqual([mockOrder1]);
      expect(state.orders).toHaveLength(1);
    });

    it('должен сохранить ошибку и установить loading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов';

      const action = {
        type: getOrders.rejected.type,
        error: { message: errorMessage }
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('Асинхронный экшен getOrderByNumber', () => {
    it('должен установить loading в true при pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен добавить новый заказ в список при fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder1
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(mockOrder1);
      expect(state.error).toBeUndefined();
    });

    it('не должен добавить заказ, если он уже существует в списке', () => {
      const stateWithOrder = {
        ...initialState,
        orders: [mockOrder1]
      };

      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder1
      };

      const state = feedReducer(stateWithOrder, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(mockOrder1);
    });

    it('должен добавить новый заказ к существующим при fulfilled', () => {
      const stateWithOrder = {
        ...initialState,
        orders: [mockOrder1]
      };

      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder2
      };

      const state = feedReducer(stateWithOrder, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toHaveLength(2);
      expect(state.orders[0]).toEqual(mockOrder1);
      expect(state.orders[1]).toEqual(mockOrder2);
    });

    it('должен сохранить ошибку и установить loading в false при rejected', () => {
      const errorMessage = 'Заказ не найден';

      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };

      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('Последовательность вызовов', () => {
    it('должен корректно обработать последовательные загрузки', () => {
      // Загружаем ленту заказов
      let state = feedReducer(
        initialState,
        { type: getFeeds.pending.type }
      );

      state = feedReducer(
        state,
        {
          type: getFeeds.fulfilled.type,
          payload: mockFeedData
        }
      );

      expect(state.feed.orders).toHaveLength(2);
      expect(state.feed.total).toBe(100);

      // Загружаем личные заказы
      state = feedReducer(
        state,
        { type: getOrders.pending.type }
      );

      state = feedReducer(
        state,
        {
          type: getOrders.fulfilled.type,
          payload: [mockOrder1]
        }
      );

      expect(state.orders).toHaveLength(1);
      // feed не должен измениться
      expect(state.feed.orders).toHaveLength(2);
    });
  });
});

