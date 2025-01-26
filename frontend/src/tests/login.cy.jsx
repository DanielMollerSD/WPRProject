import React from "react";
import { mount } from "cypress/react"; 
import { MemoryRouter } from "react-router-dom"; 
import Login from "../pages/login"; 

describe("Login Component", () => {
  beforeEach(() => {
 
    mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  it("renders the login form correctly", () => {
   
    cy.get("h2").should("contain", "Inloggen");
    cy.get("#email")
      .should("exist")
      .and("have.attr", "placeholder", "Voer uw email in");
    cy.get("#password")
      .should("exist")
      .and("have.attr", "placeholder", "Voer uw wachtwoord in");
    cy.get("#LoginButton").should("exist").and("contain", "Inloggen");
  });

  it("accepts user input for email and password", () => {
    
    cy.get("#email")
      .type("testuser@example.com")
      .should("have.value", "testuser@example.com");

    cy.get("#password").type("password123").should("have.value", "password123");
  });

  it("shows error messages for invalid input", () => {
  
    cy.get("#LoginButton").click();
    cy.get("#email:invalid").should("exist");
    cy.get("#password:invalid").should("exist");
  });

  it("triggers the login process when submitted", () => {
 
    cy.intercept("POST", "localhost:7265/api/Login", {
      statusCode: 200,
    }).as("loginRequest");

    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("password123");
    cy.get("#LoginButton").click();

    
    // cy.wait("@loginRequest").then((interception) => {
    //   expect(interception.request.body).to.deep.equal({
    //     email: "testuser@example.com",
    //     password: "password1234567",
    //   });
    // });
  });
});
