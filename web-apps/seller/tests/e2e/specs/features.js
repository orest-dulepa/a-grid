describe.skip('Features', () => {
  before(() => {
    cy.clearStorageData();
    cy.initRoutes();
    cy.login();
  });

  beforeEach(() => {
    cy.initRoutes();
  });

  it('Should visit features page, load account Info successfully', () => {
    cy.visit(`${Cypress.env('BASE_URL')}/features`);

    // Start loading
    cy.get('.spinner').should('be.visible');

    cy.wait('@getAccountInfo').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    cy.wait('@getRecentPageCrawls', { timeout: 30000 }).then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
    });
    // Wait possible vue components render delay
    cy.wait(2000);

    // Spinner removed.
    cy.get('.spinner').should('not.exist');
  });

  it('Should has features page components', () => {
    // Page crawls
    cy.get('.features-list__box').should('exist');
    cy.get('.features-list__box').its('length').should('eq', 30);
    // Highchart
    cy.get('.highcharts-root').should('exist');
  });
});
