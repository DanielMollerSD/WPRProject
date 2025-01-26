import React from "react";
import Login from "../../src/pages/login";
import './../../src/pages/login';


describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login'); // Adjust the path to where your login page is served
  });

  it('should load the login page correctly', () => {
    cy.get('h2').should('contain', 'Inloggen');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Inloggen');
  });

  it('should show error message with invalid credentials', () => {
    cy.intercept('POST', '/Login').as('loginRequest');
    
    cy.get('input[name="email"]').type('invalidemail@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.get('.error-message').should('be.visible').and('contain', 'Login failed');
  });

  it('should redirect to home page on successful login', () => {
    cy.intercept('POST', '/Login', {
      statusCode: 200,
      body: { token: 'fake_token' },
    }).as('loginRequest');

    cy.get('input[name="email"]').type('validemail@example.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`); // Adjust to your homepage URL
    cy.getLocalStorage('access_token').should('exist');
  });
});
