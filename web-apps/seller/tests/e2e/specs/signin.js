describe.skip('Sign In', () => {
  before(() => {
    cy.clearStorageData();
  });

  beforeEach(() => {
    cy.initRoutes();
  });

  it('Should show the login page on initial visit', () => {
    cy.visit(Cypress.env('BASE_URL'));

    cy.location('pathname').should('eq', '/login');

    cy.contains('h1 span', 'Log in');
  });

  it('Should login successfully and redirect to dashboard', () => {
    cy.login();

    // Wait possible vue components render delay
    cy.wait(1000);
    cy.visit(`${Cypress.env('BASE_URL')}/account`);
    cy.location('pathname').should('eq', '/account');

    cy.wait('@getAccountInfo').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  });
});
