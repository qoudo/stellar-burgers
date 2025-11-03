/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { SELECTORS } from './selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Добавить ингредиент в конструктор по имени
       * @example cy.addIngredient('Краторная булка N-200i')
       */
      addIngredient(ingredientName: string): Chainable<void>;

      /**
       * Открыть модальное окно ингредиента по имени
       * @example cy.openIngredientModal('Краторная булка N-200i')
       */
      openIngredientModal(ingredientName: string): Chainable<void>;

      /**
       * Проверить, что ингредиент добавлен в конструктор
       * @example cy.checkIngredientInConstructor('Краторная булка N-200i', 'bun')
       */
      checkIngredientInConstructor(
        ingredientName: string,
        type: 'bun' | 'filling'
      ): Chainable<void>;
    }
  }
}

// Добавить ингредиент в конструктор
Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName).closest('li').find('button').click();
});

// Открыть модальное окно ингредиента
Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName).click();
  cy.get(SELECTORS.modal, { timeout: 10000 }).should('exist');
});

// Проверить, что ингредиент добавлен в конструктор
Cypress.Commands.add(
  'checkIngredientInConstructor',
  (ingredientName: string, type: 'bun' | 'filling') => {
    if (type === 'bun') {
      cy.get(SELECTORS.constructorBunTop)
        .contains(ingredientName)
        .should('exist');
      cy.get(SELECTORS.constructorBunBottom)
        .contains(ingredientName)
        .should('exist');
    } else {
      cy.get(SELECTORS.constructorIngredients)
        .contains(ingredientName)
        .should('exist');
    }
  }
);

export {};
