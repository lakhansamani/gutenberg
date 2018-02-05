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
 * @param {Component} OriginalComponent   Component requiring setTimeout
 *
 * @returns {Component}                   Wrapped component.
 */
function withSafeTimeout( OriginalComponent ) {
	return class WrappedComponent extends Component {
		constructor() {
			super( ...arguments );
			this.timeouts = [];
			this.setTimeout = this.setTimeout.bind( this );
			this.clear = this.clear.bind( this );
		}

		componentWillUnmount() {
			this.timeouts.forEach( clearTimeout );
		}

		setTimeout( fn, delay ) {
			const id = setTimeout( () => {
				fn();
				this.clear( id );
			}, delay );
			this.timeouts.push( id );
			return id;
		}

		clear( id ) {
			this.timeouts = this.timeouts.filter( t => t !== id );
		}

		render() {
			return (
				<OriginalComponent
					{ ...this.props }
					setTimeout={ this.setTimeout }
				/>
			);
		}
	};
}

export default withSafeTimeout;
