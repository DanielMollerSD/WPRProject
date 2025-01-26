describe('Individual User Flow - Routing Only', () => {
    it('should follow the routing from login to logout', () => {
      // Bezoek de homepagina
      cy.visit('/');
  
      // Ga naar de loginpagina
      cy.visit('/login');
  
      // Vul de login gegevens in
      cy.get('input[name="email"]').type('lol@gmail.com');
      cy.get('input[name="password"]').type('12345678');
  
      // Klik op de login knop
      cy.get('button[type="submit"]').click();
  
      // Controleer of de URL correct is na het inloggen
      cy.url().should('not.include', '/login');
  
      // Navigeer naar de Vehicle Overview pagina
      cy.visit('/vehicle-overview');
      cy.url().should('include', '/vehicle-overview');
  
      // Navigeer naar de Individual Rent pagina
      cy.visit('/individual/rents');
      cy.url().should('include', '/individual/rents');
  
      // Navigeer naar de Account Settings pagina
      cy.visit('/account-settings');
      cy.url().should('include', '/account-settings');
  
      // Wacht en klik op de logout Link
      cy.contains('Logout').click();
  
      // Controleer of je bent uitgelogd en terug bent op de loginpagina
      cy.url().should('include', '/');
    });
  });
  