describe('Wagenparkbeheerder User Flow - Routing Only', () => {
  it('should follow the routing from login to logout', () => {
    // Bezoek de homepagina
    cy.visit('/');

    // Ga naar de loginpagina
    cy.visit('/login');

    // Vul de login gegevens in
    cy.get('input[name="email"]').type('channievanloenen@gmail.com');
    cy.get('input[name="password"]').type('12345678');

    // Klik op de login knop
    cy.get('button[type="submit"]').click();

    // Controleer of de URL correct is na het inloggen
    cy.url().should('not.include', '/login');

    // Navigeer naar de Overzichtpagina
    cy.visit('/business/rents');
    cy.url().should('include', '/business/rents');

    // Navigeer naar de Medewerkerpagina
    cy.visit('/business-account-crud');
    cy.url().should('include', '/business-account-crud');

    // Navigeer naar de Abonnementpagina
    cy.visit('/subscription-select');
    cy.url().should('include', '/subscription-select');

    // Wacht en klik op de logout Link
    cy.contains('Logout').click();

    // Controleer of je bent uitgelogd en terug bent op de loginpagina
    cy.url().should('include', '/');
  });
});
