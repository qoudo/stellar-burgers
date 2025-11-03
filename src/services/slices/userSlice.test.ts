import userReducer, {
  initialState,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  authChecked
} from './userSlice';
import { TUser } from '../../utils/types';

describe('Тестирование userSlice', () => {
  // Тестовые данные
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Тестовый пользователь'
  };

  const mockUpdatedUser: TUser = {
    email: 'updated@example.com',
    name: 'Обновленный пользователь'
  };

  describe('Начальное состояние', () => {
    it('должно быть корректным', () => {
      expect(initialState).toEqual({
        isAuthChecked: false,
        user: null,
        error: undefined
      });
    });
  });

  describe('Синхронный экшен authChecked', () => {
    it('должен установить isAuthChecked в true', () => {
      const state = userReducer(initialState, authChecked());

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('Асинхронный экшен registerUser', () => {
    it('должен очистить ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const action = { type: registerUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeUndefined();
    });

    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };

      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить ошибку при rejected', () => {
      const errorMessage = 'Пользователь уже существует';

      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };

      const state = userReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('Асинхронный экшен loginUser', () => {
    it('должен очистить ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка входа'
      };

      const action = { type: loginUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeUndefined();
    });

    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };

      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('должен сохранить ошибку при rejected', () => {
      const errorMessage = 'Неверный email или пароль';

      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };

      const state = userReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('Асинхронный экшен getUser', () => {
    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };

      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен установить isAuthChecked в true при rejected', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Не авторизован' }
      };

      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('Асинхронный экшен updateUser', () => {
    it('должен обновить данные пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUpdatedUser
      };

      const state = userReducer(stateWithUser, action);

      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен корректно обновить только имя пользователя', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      const updatedUser: TUser = {
        ...mockUser,
        name: 'Новое имя'
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };

      const state = userReducer(stateWithUser, action);

      expect(state.user?.name).toBe('Новое имя');
      expect(state.user?.email).toBe(mockUser.email);
    });
  });

  describe('Асинхронный экшен logoutUser', () => {
    it('должен очистить данные пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Последовательность вызовов', () => {
    it('должен корректно обработать регистрацию, затем выход', () => {
      // Регистрация
      let state = userReducer(initialState, {
        type: registerUser.fulfilled.type,
        payload: mockUser
      });

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      // Выход
      state = userReducer(state, { type: logoutUser.fulfilled.type });

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен корректно обработать вход, обновление данных, затем выход', () => {
      // Вход
      let state = userReducer(initialState, {
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      expect(state.user).toEqual(mockUser);

      // Обновление
      state = userReducer(state, {
        type: updateUser.fulfilled.type,
        payload: mockUpdatedUser
      });

      expect(state.user).toEqual(mockUpdatedUser);

      // Выход
      state = userReducer(state, { type: logoutUser.fulfilled.type });

      expect(state.user).toBeNull();
    });

    it('должен корректно обработать ошибку входа и повторную попытку', () => {
      // Неудачный вход
      let state = userReducer(initialState, {
        type: loginUser.rejected.type,
        error: { message: 'Неверный пароль' }
      });

      expect(state.error).toBe('Неверный пароль');
      expect(state.user).toBeNull();

      // Повторная попытка - pending
      state = userReducer(state, { type: loginUser.pending.type });

      expect(state.error).toBeUndefined();

      // Успешный вход
      state = userReducer(state, {
        type: loginUser.fulfilled.type,
        payload: mockUser
      });

      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeUndefined();
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
