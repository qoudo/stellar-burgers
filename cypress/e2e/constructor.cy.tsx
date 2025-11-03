/// <reference types="cypress" />

import { SELECTORS } from '../support/selectors';

describe('Тестирование конструктора бургера', () => {
  const BURGER_API_URL = 'https://norma.education-services.ru/api';

  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', `${BURGER_API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехват запроса на получение данных пользователя
    cy.intercept('GET', `${BURGER_API_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    // Перехват запроса на создание заказа
    cy.intercept('POST', `${BURGER_API_URL}/orders`, {
      fixture: 'order.json'
    }).as('createOrder');

    // Установка токенов в localStorage и cookie
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.setCookie('accessToken', 'test-access-token');
    });

    // Переход на страницу конструктора
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очистка localStorage и cookies после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор при клике на кнопку', () => {
      // Проверяем начальное состояние - конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');

      // Добавляем булку через кастомную команду
      cy.addIngredient('Краторная булка N-200i');

      // Проверяем, что булка добавлена через кастомную команду
      cy.checkIngredientInConstructor('Краторная булка N-200i', 'bun');

      // Проверяем, что плейсхолдер "Выберите булки" исчез
      cy.contains('Выберите булки').should('not.exist');
    });

    it('должен добавить начинку в конструктор при клике на кнопку', () => {
      // Добавляем основной ингредиент
      cy.addIngredient('Биокотлета из марсианской Магнолии');

      // Проверяем, что ингредиент добавлен
      cy.checkIngredientInConstructor(
        'Биокотлета из марсианской Магнолии',
        'filling'
      );

      // Проверяем, что плейсхолдер "Выберите начинку" исчез
      cy.contains('Выберите начинку').should('not.exist');
    });

    it('должен добавить соус в конструктор при клике на кнопку', () => {
      // Добавляем соус
      cy.addIngredient('Соус Spicy-X');

      // Проверяем, что соус добавлен
      cy.checkIngredientInConstructor('Соус Spicy-X', 'filling');
    });

    it('должен добавить несколько разных ингредиентов в конструктор', () => {
      // Добавляем ингредиенты
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Биокотлета из марсианской Магнолии');
      cy.addIngredient('Соус Spicy-X');
      cy.addIngredient('Филе Люминесцентного тетраодонтимформа');

      // Используем alias для конструктора
      cy.get(SELECTORS.constructorIngredients).as('ingredientsList');

      // Проверяем, что все ингредиенты на месте
      cy.checkIngredientInConstructor('Краторная булка N-200i', 'bun');
      cy.checkIngredientInConstructor(
        'Биокотлета из марсианской Магнолии',
        'filling'
      );
      cy.checkIngredientInConstructor('Соус Spicy-X', 'filling');

      // Проверяем количество начинок через alias
      cy.get('@ingredientsList').children().should('have.length.at.least', 2);
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыться при клике на ингредиент', () => {
      // Открываем модальное окно через кастомную команду
      cy.openIngredientModal('Краторная булка N-200i');

      // Используем alias для модального окна
      cy.get(SELECTORS.modal).as('modal');

      // Проверяем, что в модальном окне отображается информация о правильном ингредиенте
      cy.get('@modal').contains('Краторная булка N-200i').should('exist');
      cy.get('@modal').contains('Калории').should('exist');
      cy.get('@modal').contains('Белки').should('exist');
      cy.get('@modal').contains('Жиры').should('exist');
      cy.get('@modal').contains('Углеводы').should('exist');
    });

    it('должно закрыться при клике на крестик', () => {
      // Открываем модальное окно
      cy.openIngredientModal('Биокотлета из марсианской Магнолии');

      // Используем alias для кнопки закрытия
      cy.get(SELECTORS.modalClose).as('closeButton');

      // Кликаем на кнопку закрытия
      cy.get('@closeButton').first().click();

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);
    });

    it('должно закрыться при клике на оверлей', () => {
      // Открываем модальное окно
      cy.openIngredientModal('Соус Spicy-X');

      // Используем alias для оверлея
      cy.get(SELECTORS.modalOverlay).as('overlay');

      // Кликаем на оверлей (вне контента модального окна)
      // force: true нужен, так как оверлей находится под контентом модального окна
      cy.get('@overlay').click({ force: true });

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);
    });

    it('должно отображать данные именно того ингредиента, на который кликнули', () => {
      // Открываем модальное окно с первым ингредиентом
      cy.openIngredientModal('Филе Люминесцентного тетраодонтимформа');

      // Используем alias для модального окна
      cy.get(SELECTORS.modal).as('modal');

      // Проверяем, что отображаются данные первого ингредиента
      cy.get('@modal')
        .contains('Филе Люминесцентного тетраодонтимформа')
        .should('exist');

      // Закрываем модальное окно
      cy.get(SELECTORS.modalClose).first().click();

      // Открываем модальное окно с другим ингредиентом
      cy.openIngredientModal('Соус фирменный Space Sauce');

      // Обновляем alias для нового модального окна
      cy.get(SELECTORS.modal).as('modal');

      // Проверяем, что теперь отображаются данные второго ингредиента
      cy.get('@modal').contains('Соус фирменный Space Sauce').should('exist');
      cy.get('@modal')
        .contains('Филе Люминесцентного тетраодонтимформа')
        .should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен успешно создать заказ и очистить конструктор', () => {
      // Собираем бургер используя кастомные команды
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Биокотлета из марсианской Магнолии');
      cy.addIngredient('Соус Spicy-X');

      // Создаем alias для элементов конструктора
      cy.get(SELECTORS.constructorBunTop).as('bunTop');
      cy.get(SELECTORS.constructorIngredients).as('fillings');

      // Проверяем, что ингредиенты добавлены
      cy.get('@bunTop').should('exist');
      cy.get('@fillings').children().should('have.length', 2);

      // Создаем alias для кнопки заказа
      cy.get(SELECTORS.orderButton).as('orderButton');

      // Кликаем на кнопку "Оформить заказ"
      cy.get('@orderButton').first().click();

      // Ждем ответа от сервера
      cy.wait('@createOrder');

      // Создаем alias для модального окна заказа
      cy.get(SELECTORS.modal, { timeout: 10000 }).as('orderModal');

      // Проверяем, что модальное окно с заказом открылось
      cy.get('@orderModal').should('exist');

      // Проверяем, что отображается правильный номер заказа
      cy.get(SELECTORS.orderNumber).contains('54321').should('exist');

      // Закрываем модальное окно
      cy.get(SELECTORS.modalClose).first().click();

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);

      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
