import React from "react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import SignUpBusiness from "../pages/signup-business"; // Adjust the import path if needed

describe("SignUpBusiness Component", () => {
  it("should render the signup form correctly", () => {
    cy.mount(
      <MemoryRouter>
        <SignUpBusiness />
      </MemoryRouter>
    );

    // Check if form elements are enabled and visible
    cy.get('input[name="voornaam"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('input[name="achternaam"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('input[name="tussenvoegsel"]')
      .should("be.visible")
      .and("not.be.disabled"); // Ensure this is not disabled
    cy.get('input[name="email"]').should("be.visible").and("not.be.disabled");
    cy.get('input[name="naam"]').should("be.visible").and("not.be.disabled");
    cy.get('input[name="adres"]').should("be.visible").and("not.be.disabled");
    cy.get('input[name="postcode"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('input[name="kvk"]').should("be.visible").and("not.be.disabled");
  });

  it("should handle form input and validation", () => {
    cy.mount(
      <MemoryRouter>
        <SignUpBusiness />
      </MemoryRouter>
    );

    
    cy.get('input[name="voornaam"]').type("John");
    cy.get('input[name="achternaam"]').type("Doe");
    cy.get('input[name="tussenvoegsel"]').type("van");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="naam"]').type("Doe Enterprises");
    cy.get('input[name="adres"]').type("Main Street 123");
    cy.get('input[name="postcode"]').type("1234AB");
    cy.get('input[name="kvk"]').type("12345678");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("password123");

    cy.intercept('POST', '/api/Business/register', {
        statusCode: 400,
        body: { message: 'An error occurred. Please try again.' },
      }).as('registerRequest');
      
    
      cy.get('form').submit();
      
      
      cy.contains('An error occurred. Please try again.').should('be.visible');
      

e
    cy.wait("@registerRequest", { timeout: 10000 }); 
    cy.url().should("include", "/login"); 
  });

  it("should show an error if passwords do not match", () => {
    cy.mount(
      <MemoryRouter>
        <SignUpBusiness />
      </MemoryRouter>
    );


    cy.get('input[name="voornaam"]').type("John");
    cy.get('input[name="achternaam"]').type("Doe");
    cy.get('input[name="tussenvoegsel"]').type("van");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="naam"]').type("Doe Enterprises");
    cy.get('input[name="adres"]').type("Main Street 123");
    cy.get('input[name="postcode"]').type("1234AB");
    cy.get('input[name="kvk"]').type("12345678");

    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("password456");

   
    cy.get("form").submit();

   
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Passwords do not match.");
    });
  });

  it("should show an error if password is too short", () => {
    cy.mount(
      <MemoryRouter>
        <SignUpBusiness />
      </MemoryRouter>
    );


    cy.get('input[name="voornaam"]').type("John");
    cy.get('input[name="achternaam"]').type("Doe");
    cy.get('input[name="tussenvoegsel"]').type("van");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="naam"]').type("Doe Enterprises");
    cy.get('input[name="adres"]').type("Main Street 123");
    cy.get('input[name="postcode"]').type("1234AB");
    cy.get('input[name="kvk"]').type("12345678");

  
    cy.get('input[name="password"]').type("short");
    cy.get('input[name="password-repeat"]').type("short");

   
    cy.get("form").submit();

   
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Password must be at least 8 characters long.");
    });
  });
});
