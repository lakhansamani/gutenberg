describe( 'Hello Gutenberg', () => {
	before( () => {
		cy.newPost();
	} );

	it( 'Should show the New Post Page in Gutenberg', () => {
		// Assertions
		cy.url().should( 'include', 'post-new.php' );
		cy.get( '[placeholder="Add title"]' ).should( 'exist' );
	} );

	it( 'Should have no history', () => {
		cy.get( '.editor-history__undo:not( :disabled )' ).should( 'not.exist' );
		cy.get( '.editor-history__redo:not( :disabled )' ).should( 'not.exist' );
	} );

	it( 'Should not prompt to confirm unsaved changes', ( done ) => {
		cy.window().then( ( window ) => {
			window.addEventListener( 'beforeunload', ( event ) => {
				expect( event.returnValue ).to.be.empty;

				done();
			} );
		} );

		cy.reload();
	} );
} );
