describe('Sanctioned entities', () => {
  beforeEach(() => {
    // Visiting the page before each test
    cy.visit('https://localhost:44409/sanctioned-entities'); // Update with your application's URL if needed
  });

  it('should load and display the list of entities', () => {
    // Wait for the entities to load (simulate API call response)
    cy.wait(1000); // You can adjust this wait or use intercept to mock API calls

    // Verify that the table is displayed after loading
    cy.get('table[aria-labelledby="tableLabel"]').should('exist');
  });

  it('should open the Create Entity modal when clicking "Create Entity" button', () => {
    // Click the Create Entity button
    cy.get('button').contains('Create Entity').click();
    cy.wait(2000);

    // Verify the modal is open by checking the modal title
    cy.get('h2').contains('Create Sanctioned Entity').should('be.visible');
    cy.get('form').should('be.visible');
  });

  it('should close the modal when clicking "Cancel"', () => {
    // Open the modal
    cy.get('button').contains('Create Entity').click();

    cy.wait(2000);

    // Click the Cancel button in the modal
    cy.get('button').contains('Cancel').click();

    // Verify that the modal is closed (modal should no longer be visible)
    cy.get('h2#mat-dialog-title-0').should('not.exist');
  });

  it('should create a new entity and close the modal', () => {
    // Open the modal
    cy.get('button').contains('Create Entity').click();
    cy.wait(2000);

    // Fill in the form fields (assuming you have input fields for entity name, etc.)
    cy.get('input[formControlName="name"]').type('New Entity Name');
    cy.get('input[formControlName="domicile"]').type('New Entity Name');
    cy.get('input#statusSwitch').check();

    cy.wait(2000);

    // Click the Create button
    cy.get('button[type="submit"]').click();

    // Verify that the new entity is in the table (assuming the table updates after creation)
    cy.get('table tbody tr').last().contains('New Entity Name');
  });

  it('should display the entity status correctly', () => {

    // any td with text-success means Accepted and vice a versa
    cy.get('table td.text-success').should('contain', 'Accepted');
    cy.get('table td.text-danger').should('contain', 'Rejected');

  });

  it('should show an error message for required fields when the form is submitted without filling in the fields', () => {
    cy.get('button').contains('Create Entity').click();
    cy.wait(1000);

    // Touch Name field
    cy.get('input[formControlName="name"]').focus().blur();

    // Touch Domicile field
    cy.get('input[formControlName="domicile"]').focus().blur();

    // Check for validation errors on Name and Domicile fields
    cy.get('mat-error').should('contain', 'Name is required.');
    cy.get('mat-error').should('contain', 'Domicile is required.');

     //submit button should be disabled state
    cy.get('button[type="submit"]').should('be.disabled');
    cy.wait(1000);
  });
});
