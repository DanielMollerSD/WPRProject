import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import FrontofficeCRUD from "../pages/frontoffice-crud"// Adjust path as necessary

describe("Frontoffice CRUD - React Web", () => {
  beforeEach(() => {
    
    cy.intercept("GET", `${Cypress.env("VITE_APP_API_URL")}/Employee`, {
      statusCode: 200,
      body: {
        $values: [
          {
            id: 1,
            email: "employee1@example.com",
            role: "Frontoffice",
          },
          {
            id: 2,
            email: "employee2@example.com",
            role: "Frontoffice",
          },
        ],
      },
    }).as("fetchEmployees");

    cy.intercept("POST", `${Cypress.env("VITE_APP_API_URL")}/Employee/register-carsandall`, {
      statusCode: 201,
      body: { message: "Employee created" },
    }).as("createEmployee");

    cy.intercept("DELETE", `${Cypress.env("VITE_APP_API_URL")}/Employee/1`, {
      statusCode: 200,
      body: { message: "Employee deleted" },
    }).as("deleteEmployee");
  });

  it("should load and display frontoffice employees", () => {
    mount(
      <MemoryRouter>
        <FrontofficeCRUD />
      </MemoryRouter>
    );

   
    cy.wait("@fetchEmployees");

 
    cy.contains("Frontoffice medewerkers:").should("be.visible");
    cy.contains("employee1@example.com").should("be.visible");
    cy.contains("employee2@example.com").should("be.visible");
  });

  it("should show the form when 'Add Frontoffice Employee' is clicked", () => {
    mount(
      <MemoryRouter>
        <FrontofficeCRUD />
      </MemoryRouter>
    );

 
    cy.contains("Voeg Frontofficemedewerker toe").click();

  
    cy.contains("Nieuwe Medewerker Toevoegen").should("be.visible");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
  });

  it("should handle form submission to create an employee", () => {
    mount(
      <MemoryRouter>
        <FrontofficeCRUD />
      </MemoryRouter>
    );


    cy.contains("Voeg Frontofficemedewerker toe").click();


    cy.get('input[name="email"]').type("newemployee@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("button[type='submit']").click();

  
    cy.wait("@createEmployee");

   
    cy.contains("Nieuwe Medewerker Toevoegen").should("not.exist");
    cy.contains("employee1@example.com").should("be.visible");
    cy.contains("employee2@example.com").should("be.visible");
  });

  it("should handle employee deletion", () => {
    mount(
      <MemoryRouter>
        <FrontofficeCRUD />
      </MemoryRouter>
    );

  
    cy.wait("@fetchEmployees");

   
    cy.contains("Verwijderen").first().click();

   
    cy.on("window:confirm", () => true);

   
    cy.wait("@deleteEmployee");

    
    cy.contains("employee1@example.com").should("not.exist");
  });
});
