Cypress.Commands.add('clearStorageData', () => {
  return new Cypress.Promise(async (resolve) => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    resolve();
  });
});

Cypress.Commands.add('initRoutes', () => {
  cy.server();

  cy.route({
    method: 'POST',
    url: '**/identitytoolkit/v3/relyingparty/verifyPassword?*',
  }).as('verifyPassword');

  cy.route({
    method: 'POST',
    url: '**/identitytoolkit/v3/relyingparty/getAccountInfo?*',
  }).as('getAccountInfo');

  cy.intercept({
    method: 'POST',
    path: '**getAudiences',
  }).as('getAudiences');

  cy.intercept({
    method: 'POST',
    path: '**getRecentPageCrawls',
  }).as('getRecentPageCrawls');
});

Cypress.Commands.add('login', () => {
  cy.visit(Cypress.env('BASE_URL'));

  cy.get('input[type="email"]').type(Cypress.env('LOGIN'));
  cy.get('input[type="password"]').type(Cypress.env('PASSWORD'));

  cy.get('button[type="submit"]').click();

  cy.wait('@verifyPassword').then((xhr) => {
    expect(xhr.status).to.equal(200);
  });

  cy.wait('@getAccountInfo').then((xhr) => {
    expect(xhr.status).to.equal(200);
  });
});
