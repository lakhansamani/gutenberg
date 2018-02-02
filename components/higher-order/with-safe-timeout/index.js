/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Browser dependencies
 */
const { clearTimeout, setTimeout } = window;

/**
 * A higher-order component used to provide and manage delayed function calls
 * that ought to be bound to a component's lifecycle.
 *
 * @param {Component} OriginalComponent   Component requiring setSafeTimeout
 *
 * @returns {Component}                   Wrapped component.
 */
function withSafeTimeout( OriginalComponent ) {
	return class WrappedComponent extends Component {
		constructor() {
			super( ...arguments );
			this.timeouts = [];
			this.setSafeTimeout = this.setSafeTimeout.bind( this );
		}

		componentWillUnmount() {
			this.timeouts.forEach( clearTimeout );
		}

		setSafeTimeout( fn, delay ) {
			this.timeouts.push( setTimeout( fn, delay ) );
		}

		render() {
			return (
				<OriginalComponent
					{ ...this.props }
					setSafeTimeout={ this.setSafeTimeout }
				/>
			);
		}
	};
}

export default withSafeTimeout;
