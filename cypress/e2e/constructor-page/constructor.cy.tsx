/// <reference types="cypress" />

describe('check constructor page', function() {
    const ingredientCardBunTestId = '[data-testid="ingredient-card_bun"]';
    const ingredientCardMainTestId = '[data-testid="ingredient-card_main"]';

    const modalTestId = '[data-testid="modal"]';
    const modalCloseTestId = '[data-testid="modal-close-button"]';
    const modalOverlayTestId = '[data-testid="modal-overlay"]';

    const contructorTopTestId = '[data-testid="burger-bun-top"]';
    const contructorMainTestId = '[data-testid="burger-main-ingredient"]';
    const constructorBottomTestId = '[data-testid="burger-bun-bottom"]';

    beforeEach(() => {
        cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('placeOrder');

        window.localStorage.setItem('refreshToken', 'test-refreshToken');
        cy.setCookie('accessToken', 'test-accessToken');

        cy.visit('/');
        cy.wait('@getIngredients');
        cy.wait('@getUser');
    });

    afterEach(() => {
        cy.clearCookie('accessToken');
        window.localStorage.removeItem('refreshToken');
    });

    it('should show bun details modal', function() {
        cy.get(ingredientCardBunTestId).first().click();
        cy.get('[data-testid="ingredient-name"]').should('have.text', 'Булка');
        cy.get('[data-testid="ingredient-calories"]').should('have.text', '420');
        cy.get('[data-testid="ingredient-proteins"]').should('have.text', '80');
        cy.get('[data-testid="ingredient-fat"]').should('have.text', '24');
        cy.get('[data-testid="ingredient-carbohydrates"]').should('have.text', '53');
    });

    it('should close details modal by close button', function() {
        cy.get(ingredientCardBunTestId).first().click();
        cy.get(modalCloseTestId).click();
        cy.get(modalTestId).should('not.exist');
    });

    it('should close details modal by overlay', function() {
        cy.get(ingredientCardBunTestId).first().click();
        cy.get(modalOverlayTestId).click({ force: true });
        cy.get(modalTestId).should('not.exist');
    });

   it('should add ingredients to constructor', function() {
        cy.get(ingredientCardBunTestId).first().within(() => {
            cy.get('button').click();
        });
        cy.get(ingredientCardMainTestId).first().within(() => {
            cy.get('button').click();
        });

        cy.get(contructorTopTestId).should('contain', 'Булка');
        cy.get(constructorBottomTestId).should('contain', 'Булка');
        cy.get(contructorMainTestId).should('contain', 'Котлета');
    });

    it('should place order', function() {
        //Собираем бургер
        cy.get(ingredientCardBunTestId).first().within(() => {
            cy.get('button').click();
        });
        cy.get(ingredientCardMainTestId).first().within(() => {
            cy.get('button').click();
        });

        //Определяем объекты конструктора
        cy.get(contructorTopTestId).as('burgerTop');
        cy.get(contructorMainTestId).as('burgerMain');
        cy.get(constructorBottomTestId).as('burgerBottom');

        //Проверяем, что бургер в конструкторе
        cy.get('@burgerTop').should('contain', 'Булка');
        cy.get('@burgerBottom').should('contain', 'Булка');
        cy.get('@burgerMain').should('contain', 'Котлета');
        //Оформляем заказ
        cy.get('[data-testid="burger-constructor-button"]').click();
        cy.wait('@placeOrder').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body.success).to.be.true;
        });
        cy.get(modalTestId).should('exist');
        cy.get('[data-testid="order-number"]').should('have.text', '1928');
        //Закрываем модальное окно
        cy.get(modalCloseTestId).click();
        cy.get(modalTestId).should('not.exist');
        //Проверяем, что конструктор пуст
        cy.get('@burgerTop').should('not.exist');
        cy.get('@burgerBottom').should('not.exist');
        cy.get('@burgerMain').should('have.text', 'Выберите начинку');
    });
});