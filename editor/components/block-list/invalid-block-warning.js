/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import {
	getBlockType,
	getUnknownTypeHandlerName,
	createBlock,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { replaceBlock } from '../../store/actions';
import Warning from '../warning';

function InvalidBlockWarning( { block, attemptFixParagraph, ignoreInvalid, switchToBlockType } ) {
	const htmlBlockName = 'core/html';
	const defaultBlockType = getBlockType( getUnknownTypeHandlerName() );
	const htmlBlockType = getBlockType( htmlBlockName );
	const switchTo = ( blockType ) => () => switchToBlockType( blockType );

	return (
		<Warning>
			<p>{ defaultBlockType && htmlBlockType && sprintf( __(
				'This block appears to have been modified externally. ' +
				'Overwrite the changes or Convert to %s or %s to keep ' +
				'your changes.'
			), defaultBlockType.title, htmlBlockType.title ) }</p>
			<p>
				{ block.name === 'core/paragraph' && (
					<Button
						onClick={ attemptFixParagraph }
						isLarge
					>
						{ sprintf( __( 'Attempt Fix' ) ) }
					</Button>
				) }
				{ block.name !== 'core/paragraph' && ( <Button
					onClick={ ignoreInvalid }
					isLarge
				>
					{ sprintf( __( 'Overwrite' ) ) }
				</Button> ) }
				{ defaultBlockType && (
					<Button
						onClick={ switchTo( defaultBlockType ) }
						isLarge
					>
						{
							/* translators: Revert invalid block to another block type */
							sprintf( __( 'Convert to %s' ), defaultBlockType.title )
						}
					</Button>
				) }

				{ htmlBlockType && (
					<Button
						onClick={ switchTo( htmlBlockType ) }
						isLarge
					>
						{
							sprintf( __( 'Edit as HTML' ) )
						}
					</Button>
				) }
			</p>
		</Warning>
	);
}

export default connect(
	null,
	( dispatch, ownProps ) => {
		return {
			attemptFixParagraph() {
				const { block } = ownProps;
				const nextBlock = createBlock( block.name, {
					content: block.originalContent,
				} );
				dispatch( replaceBlock( block.uid, nextBlock ) );
			},
			ignoreInvalid() {
				const { block } = ownProps;
				const { name, attributes } = block;
				const nextBlock = createBlock( name, attributes );
				dispatch( replaceBlock( block.uid, nextBlock ) );
			},
			switchToBlockType( blockType ) {
				const { block } = ownProps;
				if ( blockType && block ) {
					const nextBlock = createBlock( blockType.name, {
						content: block.originalContent,
					} );

					dispatch( replaceBlock( block.uid, nextBlock ) );
				}
			},
		};
	}
)( InvalidBlockWarning );
