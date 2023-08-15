describe.skip('Audiences', () => {
  before(() => {
    cy.clearStorageData();
    cy.initRoutes();
    cy.login();
  });

  beforeEach(() => {
    cy.initRoutes();
  });

  it('Should visit audiences page, load account Info successfully', () => {
    cy.visit(`${Cypress.env('BASE_URL')}/audiences`);

    // Start loading
    cy.get('.spinner').should('be.visible');

    cy.wait('@getAccountInfo').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    cy.wait('@getAudiences', { timeout: 30000 }).then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    // Wait possible vue components render delay
    cy.wait(2000);

    // Spinner removed.
    cy.get('.spinner').should('not.exist');
  });

  it('Should has audiences page components', () => {
    // Matched audiences
    cy.get('.audience-row').should('exist');
    // Highchart
    cy.get('.highcharts-root').should('exist');
  });
});
