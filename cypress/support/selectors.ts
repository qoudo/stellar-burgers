// Общие селекторы для Cypress тестов
export const SELECTORS = {
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  orderNumber: '[data-cy="order-number"]',
  orderButton: '[data-cy="order-button"]',
  constructorBunTop: '[data-cy="constructor-bun-top"]',
  constructorBunBottom: '[data-cy="constructor-bun-bottom"]',
  constructorIngredients: '[data-cy="constructor-ingredients"]'
} as const;
