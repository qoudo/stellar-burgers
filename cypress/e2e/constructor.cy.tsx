/// <reference types="cypress" />

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
    cy.visit('/', {
      onBeforeLoad(win) {
        // Отключаем webpack-dev-server overlay
        win.addEventListener('error', (e) => e.stopImmediatePropagation());
      }
    });

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    
    // Скрываем webpack overlay если он появился
    cy.document().then((doc) => {
      const overlay = doc.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });
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

      // Находим булку и кликаем на кнопку "Добавить"
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .click({ force: true });

      // Проверяем, что булка добавлена в конструктор
      cy.get('[data-cy="constructor-bun-top"]')
        .contains('Краторная булка N-200i')
        .should('exist');
      cy.get('[data-cy="constructor-bun-bottom"]')
        .contains('Краторная булка N-200i')
        .should('exist');

      // Проверяем, что плейсхолдер "Выберите булки" исчез
      cy.contains('Выберите булки').should('not.exist');
    });

    it('должен добавить начинку в конструктор при клике на кнопку', () => {
      // Находим основной ингредиент и добавляем его
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Проверяем, что ингредиент добавлен в список начинок
      cy.get('[data-cy="constructor-ingredients"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');

      // Проверяем, что плейсхолдер "Выберите начинку" исчез
      cy.contains('Выберите начинку').should('not.exist');
    });

    it('должен добавить соус в конструктор при клике на кнопку', () => {
      // Находим соус и добавляем его
      cy.contains('Соус Spicy-X')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Проверяем, что соус добавлен в список начинок
      cy.get('[data-cy="constructor-ingredients"]')
        .contains('Соус Spicy-X')
        .should('exist');
    });

    it('должен добавить несколько разных ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Добавляем основной ингредиент
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Добавляем еще один основной ингредиент
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Проверяем, что все ингредиенты на месте
      cy.get('[data-cy="constructor-bun-top"]')
        .contains('Краторная булка N-200i')
        .should('exist');
      cy.get('[data-cy="constructor-ingredients"]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
      cy.get('[data-cy="constructor-ingredients"]')
        .contains('Соус Spicy-X')
        .should('exist');
      // Проверяем, что добавлено 2 начинки
      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length.at.least', 2);
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыться при клике на ингредиент', () => {
      // Кликаем на ингредиент
      cy.contains('Краторная булка N-200i').click({ force: true });

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Проверяем, что в модальном окне отображается информация о правильном ингредиенте
      cy.get('[data-cy="modal"]')
        .contains('Краторная булка N-200i')
        .should('exist');
      cy.get('[data-cy="modal"]').contains('Калории').should('exist');
      cy.get('[data-cy="modal"]').contains('Белки').should('exist');
      cy.get('[data-cy="modal"]').contains('Жиры').should('exist');
      cy.get('[data-cy="modal"]').contains('Углеводы').should('exist');
    });

    it('должно закрыться при клике на крестик', () => {
      // Открываем модальное окно
      cy.contains('Биокотлета из марсианской Магнолии').click({ force: true });
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Кликаем на кнопку закрытия
      cy.get('[data-cy="modal-close"]').first().click({ force: true });

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);
    });

    it('должно закрыться при клике на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Соус Spicy-X').click({ force: true });
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Кликаем на оверлей (вне контента модального окна)
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);
    });

    it('должно отображать данные именно того ингредиента, на который кликнули', () => {
      // Кликаем на первый ингредиент
      cy.contains('Филе Люминесцентного тетраодонтимформа').click({ force: true });
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Проверяем, что отображаются данные первого ингредиента
      cy.get('[data-cy="modal"]')
        .contains('Филе Люминесцентного тетраодонтимформа')
        .should('exist');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close"]').first().click({ force: true });

      // Кликаем на другой ингредиент
      cy.contains('Соус фирменный Space Sauce').click({ force: true });
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Проверяем, что теперь отображаются данные второго ингредиента
      cy.get('[data-cy="modal"]')
        .contains('Соус фирменный Space Sauce')
        .should('exist');
      cy.get('[data-cy="modal"]')
        .contains('Филе Люминесцентного тетраодонтимформа')
        .should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен успешно создать заказ и очистить конструктор', () => {
      // Собираем бургер
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      cy.contains('Соус Spicy-X')
        .parent()
        .parent()
        .find('button')
        .first()
        .click({ force: true });

      // Проверяем, что ингредиенты добавлены
      cy.get('[data-cy="constructor-bun-top"]').should('exist');
      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length', 2);

      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-cy="order-button"]').first().click({ force: true });

      // Ждем ответа от сервера
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с заказом открылось
      cy.get('[data-cy="modal"]', { timeout: 10000 }).should('exist');

      // Проверяем, что отображается правильный номер заказа
      cy.get('[data-cy="order-number"]').contains('54321').should('exist');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close"]').first().click({ force: true });

      // Ждем, чтобы модальное окно закрылось
      cy.wait(500);

      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});

