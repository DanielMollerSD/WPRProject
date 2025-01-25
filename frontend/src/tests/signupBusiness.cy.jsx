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

    // Type in the form fields
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

    // Mock the API request for registration
    cy.intercept('POST', '/api/Business/register', {
        statusCode: 400,
        body: { message: 'An error occurred. Please try again.' },
      }).as('registerRequest');
      
      // Submit the form and wait for the response
      cy.get('form').submit();
      
      // Check for error message in the UI
      cy.contains('An error occurred. Please try again.').should('be.visible');
      

    // Assert that the form submission works by checking if we navigate to the login page
    cy.wait("@registerRequest", { timeout: 10000 }); // Increase timeout to 10 seconds
    // Wait for the intercepted request to complete
    cy.url().should("include", "/login"); // Assuming successful submission redirects to /login
  });

  it("should show an error if passwords do not match", () => {
    cy.mount(
      <MemoryRouter>
        <SignUpBusiness />
      </MemoryRouter>
    );

    // Type in the form fields
    cy.get('input[name="voornaam"]').type("John");
    cy.get('input[name="achternaam"]').type("Doe");
    cy.get('input[name="tussenvoegsel"]').type("van");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="naam"]').type("Doe Enterprises");
    cy.get('input[name="adres"]').type("Main Street 123");
    cy.get('input[name="postcode"]').type("1234AB");
    cy.get('input[name="kvk"]').type("12345678");

    // Enter mismatched passwords
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("password456");

    // Simulate form submission
    cy.get("form").submit();

    // Assert that an error alert is shown for mismatched passwords
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

    // Enter data into the form
    cy.get('input[name="voornaam"]').type("John");
    cy.get('input[name="achternaam"]').type("Doe");
    cy.get('input[name="tussenvoegsel"]').type("van");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="naam"]').type("Doe Enterprises");
    cy.get('input[name="adres"]').type("Main Street 123");
    cy.get('input[name="postcode"]').type("1234AB");
    cy.get('input[name="kvk"]').type("12345678");

    // Enter a short password
    cy.get('input[name="password"]').type("short");
    cy.get('input[name="password-repeat"]').type("short");

    // Simulate form submission
    cy.get("form").submit();

    // Assert that the password length alert is shown
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Password must be at least 8 characters long.");
    });
  });
});
