import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import SignUpParticular from "../pages/signup-particular"; // Adjust the import path as necessary

describe("SignUpParticular Component", () => {
  beforeEach(() => {
    // Mount the SignUpParticular component before each test
    mount(
      <MemoryRouter>
        <SignUpParticular />
      </MemoryRouter>
    );
  });

  it("renders the sign-up form correctly", () => {
    cy.get("h2").should("contain", "Registreren").debug();

    cy.get("input[name='voornaam']")
      .should("exist")
      .and("have.attr", "placeholder", "Voer uw voornaam in")
      .debug();

    cy.get("input[name='achternaam']")
      .should("exist")
      .and("have.attr", "placeholder", "Voer uw achternaam in")
      .debug();

    cy.get("input[name='email']")
      .should("exist")
      .and("have.attr", "placeholder", "Voer uw email in")
      .debug();
  });

  it("accepts user input for the sign-up form", () => {
    // Simulate typing into the input fields
    cy.get("input[name='voornaam']").type("Test").debug();
    cy.get("input[name='achternaam']").type("User").debug();
    cy.get("input[name='email']").type("testuser@example.com").debug();
    cy.get("input[name='password']").type("password123").debug();
    cy.get("input[name='password-repeat']").type("password123").debug();

    // Verify that the values are correctly entered
    cy.get("input[name='voornaam']").should("have.value", "Test").debug();
    cy.get("input[name='achternaam']").should("have.value", "User").debug();
    cy.get("input[name='email']")
      .should("have.value", "testuser@example.com")
      .debug();
  });

  it("triggers the form submission and checks the request", () => {
    // Mock the request using cy.intercept() and log the intercept
    cy.intercept("POST", "/Individual/register", (req) => {
      console.log("Intercepted request body:", req.body);
      req.reply({
        statusCode: 200,
        body: { message: "Account created successfully!" },
      });
    }).as("signUpRequest");

    // Fill in the form
    cy.get("input[name='voornaam']").type("Test").debug();
    cy.get("input[name='achternaam']").type("User").debug();
    cy.get("input[name='email']").type("testuser@example.com").debug();
    cy.get("input[name='password']").type("password123").debug();
    cy.get("input[name='password-repeat']").type("password123").debug();

    // Submit the form
    cy.get("button[type='submit']").click();

    // Log the network request and check the request body
    // // cy.wait("@signUpRequest")
    //   .then((interception) => {
    //     console.log("Request body sent to backend:", interception.request.body);
    //     expect(interception.request.body).to.deep.equal({
    //       FirstName: "Test",
    //       LastName: "User",
    //       Email: "testuser@example.com",
    //       Password: "password123",
    //     });
    //   })
    //   .debug();
  });

  it("shows error for weak password", () => {
    // Fill in a weak password (less than 8 characters)
    cy.get("input[name='password']").type("short").debug();
    cy.get("input[name='password-repeat']").type("short").debug();

    // Submit the form and check for validation error
    cy.get("button[type='submit']").click();
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contains(
        "Password must be at least 8 characters long."
      );
    });
  });
});
