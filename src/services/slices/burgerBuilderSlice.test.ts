import burgerBuilderReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal,
  orderBurger,
  TBurgerBuilderState
} from './burgerBuilderSlice';
import { TIngredient } from '../../utils/types';

describe('Тестирование burgerBuilderSlice', () => {
  // Тестовые данные
  const mockBun: TIngredient = {
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
  };

  const mockIngredient1: TIngredient = {
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
  };

  const mockIngredient2: TIngredient = {
    _id: '3',
    name: 'Тестовый соус',
    type: 'sauce',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: 'test.png',
    image_mobile: 'test-mobile.png',
    image_large: 'test-large.png'
  };

  describe('Начальное состояние', () => {
    it('должно быть корректным', () => {
      expect(initialState).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: undefined
      });
    });
  });

  describe('Экшен addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = burgerBuilderReducer(initialState, action);

      expect(state.bun).toBeDefined();
      expect(state.bun?.name).toBe('Тестовая булка');
      expect(state.bun?.type).toBe('bun');
      expect(state.bun?.id).toBeDefined();
    });

    it('должен заменить булку при добавлении новой', () => {
      const firstBun: TIngredient = {
        ...mockBun,
        _id: '1',
        name: 'Первая булка'
      };
      const secondBun: TIngredient = {
        ...mockBun,
        _id: '2',
        name: 'Вторая булка'
      };

      let state = burgerBuilderReducer(initialState, addIngredient(firstBun));
      expect(state.bun?.name).toBe('Первая булка');

      state = burgerBuilderReducer(state, addIngredient(secondBun));
      expect(state.bun?.name).toBe('Вторая булка');
    });

    it('должен добавить основной ингредиент в список начинок', () => {
      const action = addIngredient(mockIngredient1);
      const state = burgerBuilderReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Тестовая начинка');
      expect(state.ingredients[0].type).toBe('main');
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('должен добавить соус в список начинок', () => {
      const action = addIngredient(mockIngredient2);
      const state = burgerBuilderReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Тестовый соус');
      expect(state.ingredients[0].type).toBe('sauce');
    });

    it('должен добавить несколько ингредиентов в список начинок', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerBuilderReducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe('Тестовая начинка');
      expect(state.ingredients[1].name).toBe('Тестовый соус');
    });

    it('должен добавлять уникальный id каждому ингредиенту', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerBuilderReducer(state, addIngredient(mockIngredient1));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('Экшен removeIngredient', () => {
    it('должен удалить ингредиент из списка по id', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      const ingredientId = state.ingredients[0].id;

      state = burgerBuilderReducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен удалить только указанный ингредиент', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerBuilderReducer(state, addIngredient(mockIngredient2));

      const firstIngredientId = state.ingredients[0].id;

      state = burgerBuilderReducer(state, removeIngredient(firstIngredientId));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Тестовый соус');
    });

    it('не должен изменять состояние при удалении несуществующего id', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      const initialLength = state.ingredients.length;

      state = burgerBuilderReducer(state, removeIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(initialLength);
    });
  });

  describe('Экшен moveIngredient', () => {
    it('должен переместить ингредиент с одной позиции на другую', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerBuilderReducer(state, addIngredient(mockIngredient2));

      const firstIngredientName = state.ingredients[0].name;
      const secondIngredientName = state.ingredients[1].name;

      state = burgerBuilderReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 1 })
      );

      expect(state.ingredients[0].name).toBe(secondIngredientName);
      expect(state.ingredients[1].name).toBe(firstIngredientName);
    });

    it('должен корректно перемещать ингредиенты в списке из трех элементов', () => {
      let state = burgerBuilderReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerBuilderReducer(state, addIngredient(mockIngredient2));
      state = burgerBuilderReducer(
        state,
        addIngredient({
          ...mockIngredient1,
          _id: '4',
          name: 'Третий ингредиент'
        })
      );

      // Перемещаем первый элемент на последнюю позицию
      state = burgerBuilderReducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(state.ingredients[0].name).toBe('Тестовый соус');
      expect(state.ingredients[1].name).toBe('Третий ингредиент');
      expect(state.ingredients[2].name).toBe('Тестовая начинка');
    });
  });

  describe('Экшен clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = burgerBuilderReducer(initialState, addIngredient(mockBun));
      state = burgerBuilderReducer(state, addIngredient(mockIngredient1));

      state = burgerBuilderReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Экшен closeOrderModal', () => {
    it('должен закрыть модальное окно заказа', () => {
      const stateWithModal: TBurgerBuilderState = {
        ...initialState,
        orderModalData: {
          _id: '123',
          status: 'done',
          name: 'Тестовый бургер',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 12345,
          ingredients: ['1', '2']
        }
      };

      const state = burgerBuilderReducer(stateWithModal, closeOrderModal());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('Асинхронный экшен orderBurger', () => {
    it('должен установить orderRequest в true при pending', () => {
      const action = { type: orderBurger.pending.type };
      const state = burgerBuilderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен обработать успешное создание заказа при fulfilled', () => {
      const mockOrder = {
        _id: '123',
        status: 'done' as const,
        name: 'Тестовый бургер',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        number: 12345,
        ingredients: ['1', '2']
      };

      let state = burgerBuilderReducer(initialState, addIngredient(mockBun));
      state = burgerBuilderReducer(state, addIngredient(mockIngredient1));

      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockOrder
      };

      state = burgerBuilderReducer(state, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен обработать ошибку при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';

      const action = {
        type: orderBurger.rejected.type,
        error: { message: errorMessage }
      };

      const state = burgerBuilderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
