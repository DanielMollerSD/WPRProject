import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import SignUpBackoffice from "../pages/signup-backoffice";

describe("Sign Up Backoffice - React Web", () => {
  beforeEach(() => {
    
    cy.intercept(
      "POST",
      `${Cypress.env("REACT_APP_API_URL")}/Employee/register-carsandall`,
      (req) => {
        req.reply((res) => {
     
          res.statusCode = 200;
          res.body = { message: "Account created successfully!" };
        });
      }
    ).as("registerRequest");
  });

  it("should successfully register a new backoffice user", () => {
    
    mount(
      <MemoryRouter>
        <SignUpBackoffice />
      </MemoryRouter>
    );

   
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("password123");

   
    cy.get('input[type="checkbox"]').check();


    cy.get('button[type="submit"]').click();

   
    cy.wait("@registerRequest");

   
    cy.url().should("include", "/login");

 
    cy.contains("Account created successfully!").should("be.visible");
  });

  it("should show an error if passwords do not match", () => {
   
    mount(
      <MemoryRouter>
        <SignUpBackoffice />
      </MemoryRouter>
    );


    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("differentpassword");


    cy.get('button[type="submit"]').click();

  
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Passwords do not match.");
    });
  });

  it("should show an error if the password is too short", () => {
  
    mount(
      <MemoryRouter>
        <SignUpBackoffice />
      </MemoryRouter>
    );

  
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("short");
    cy.get('input[name="password-repeat"]').type("short");


    cy.get('button[type="submit"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Password must be at least 8 characters long.");
    });
  });

  it("should handle server-side errors gracefully", () => {
  
    cy.intercept(
      "POST",
      `${Cypress.env("REACT_APP_API_URL")}/Employee/register-carsandall`,
      {
        statusCode: 400,
        body: { message: "Error: Email already taken" },
      }
    ).as("registerRequest");

  
    mount(
      <MemoryRouter>
        <SignUpBackoffice />
      </MemoryRouter>
    );


    cy.get('input[name="email"]').type("existing@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password-repeat"]').type("password123");
  
    cy.get('button[type="submit"]').click();

   
    cy.wait("@registerRequest");

  
    cy.contains("Error: Email already taken").should("be.visible");
  });
});
