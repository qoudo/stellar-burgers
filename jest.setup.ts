import '@testing-library/jest-dom';

// Мокируем глобальные объекты, которые могут быть недоступны в тестовом окружении
global.fetch = jest.fn();

// Мокируем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

global.localStorage = localStorageMock as unknown as Storage;

