describe('Backoffice User Flow - Routing Only', () => {
  it('should follow the routing from login to logout', () => {
    // Bezoek de homepagina
    cy.visit('/');

    // Ga naar de loginpagina
    cy.visit('/login');

    // Vul de login gegevens in
    cy.get('input[name="email"]').type('backoffice@company.com');
    cy.get('input[name="password"]').type('12345678');

    // Klik op de login knop
    cy.get('button[type="submit"]').click();

    // Controleer of de URL correct is na het inloggen
    cy.url().should('not.include', '/login');

    // Navigeer naar de Verzoekpagina
    cy.visit('/rent-requests');
    cy.url().should('include', '/rent-requests');

    // Navigeer naar de Overzichtpagina
    cy.visit('/rent-overview');
    cy.url().should('include', '/rent-overview');

    // Navigeer naar de Abonnementpagina
    cy.visit('/backoffice-subscription');
    cy.url().should('include', '/backoffice-subscription');

    // Navigeer naar de Voertuigpagina
    cy.visit('/vehicle-crud');
    cy.url().should('include', '/vehicle-crud');

    // Navigeer naar de Frontofficepagina
    cy.visit('/frontoffice-crud');
    cy.url().should('include', '/frontoffice-crud');

    // Navigeer naar de Privacy-pagina
    cy.visit('/backoffice-privacy-page');
    cy.url().should('include', '/backoffice-privacy-page');

    // Wacht en klik op de logout Link
    cy.contains('Logout').click();

    // Controleer of je bent uitgelogd en terug bent op de loginpagina
    cy.url().should('include', '/');
  });
});
