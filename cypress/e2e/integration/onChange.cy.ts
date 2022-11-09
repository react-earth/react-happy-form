describe('useForm', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('those values should be changed when we change it', () => {
    const name = 'test name';
    const selection = 'Your friends can view';

    cy.get('input[placeholder="enter name"]')
      .type(name)
      .should('have.value', name);

    cy.get('input[value="female"]').click().should('be.checked');

    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).click().should('be.checked');
    });

    cy.get('.MuiSelect-select')
      .click()
      .get('li')
      .contains(selection)
      .click()
      .get('.MuiSelect-select')
      .should('contain.text', selection);
  });
});
