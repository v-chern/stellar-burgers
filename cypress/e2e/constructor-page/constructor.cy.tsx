/// <reference types="cypress" />

describe('check constructor page', function() {
    beforeEach(() => {
        cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('placeOrder');

        window.localStorage.setItem('refreshToken', 'test-refreshToken');
        cy.setCookie('accessToken', 'test-accessToken');

        cy.visit('http://localhost:4000');
        cy.wait('@getIngredients');
        cy.wait('@getUser');
    });

    afterEach(() => {
        cy.clearCookie('accessToken');
        window.localStorage.removeItem('refreshToken');
    });

    it('should show bun details modal', function() {
        cy.get('[data-testid="ingredient-card_bun"]').first().click();
        cy.get('[data-testid="ingredient-name"]').should('have.text', 'Булка');
        cy.get('[data-testid="ingredient-calories"]').should('have.text', '420');
        cy.get('[data-testid="ingredient-proteins"]').should('have.text', '80');
        cy.get('[data-testid="ingredient-fat"]').should('have.text', '24');
        cy.get('[data-testid="ingredient-carbohydrates"]').should('have.text', '53');
    });

    it('should close details modal by close button', function() {
        cy.get('[data-testid="ingredient-card_bun"]').first().click();
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close details modal by overlay', function() {
        cy.get('[data-testid="ingredient-card_bun"]').first().click();
        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="modal"]').should('not.exist');
    });

   it('should add ingredients to constructor', function() {
        cy.get('[data-testid="ingredient-card_bun"]').first().within(() => {
            cy.get('button').click();
        });
        cy.get('[data-testid="ingredient-card_main"]').first().within(() => {
            cy.get('button').click();
        });

        cy.get('[data-testid="burger-bun-top"]').should('contain', 'Булка');
        cy.get('[data-testid="burger-bun-bottom"]').should('contain', 'Булка');
        cy.get('[data-testid="burger-main-ingredient"]').should('contain', 'Котлета');
    });

    it('should place order', function() {
        //Собираем бургер
        cy.get('[data-testid="ingredient-card_bun"]').first().within(() => {
            cy.get('button').click();
        });
        cy.get('[data-testid="ingredient-card_main"]').first().within(() => {
            cy.get('button').click();
        });

        cy.get('[data-testid="burger-bun-top"]').should('contain', 'Булка');
        cy.get('[data-testid="burger-bun-bottom"]').should('contain', 'Булка');
        cy.get('[data-testid="burger-main-ingredient"]').should('contain', 'Котлета');
        //Оформляем заказ
        cy.get('[data-testid="burger-constructor-button"]').click();
        cy.wait('@placeOrder').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.success).to.be.true;
        });
        cy.get('[data-testid="modal"]').should('exist');
        cy.get('[data-testid="order-number"]').should('have.text', '1928');
        //Закрываем модальное окно
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
        //Проверяем, что конструктор пуст
        cy.get('[data-testid="burger-bun-top"]').should('not.exist');
        cy.get('[data-testid="burger-bun-bottom"]').should('not.exist');
        cy.get('[data-testid="burger-main-ingredient"]').should('have.text', 'Выберите начинку');
    });
});