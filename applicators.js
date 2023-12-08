import { parse } from './selector.js';

export class CollationError extends Error {}

// Helper function that handles the actual function application.
// This expects select to be a function!
function _perform(select, fn, obj, options) {
	let result = [];
	options ??= {};
	// Auto-default collation to ON for unambiguous selectors, unless otherwise specified
	options.collate ??= !select.ambiguous;
	// Translate options.mode string to numerical mode
	const mode = { 'strict': 1, 'lenient': 2 }[options?.mode?.toLowerCase()];


	const resolution = select(obj, options?.references, mode);
	for (let item of resolution) {
		for (let property of item.selection) {
			const value = fn(item.target[property], property, item.target);
			// Only assign new value if it is different
			// This is important so that read operations will work even on read-only (e.g. frozen) objects
			if (value !== item.target[property])
				item.target[property] = value;
			result.push(value);
		}
	}

	// If collating - either by default or by user choice - check that all results are equal, and if they
	// are, return their value. Otherwise throw an error.
	if (options?.collate) {
		const json = JSON.stringify(result[0]);
		for (let i = 1; i < result.length; i++)
			if (json !== JSON.stringify(result[i]))
				throw new CollationError(`Expected all results to be equal when collating for selector ${select.source} but they were not`);
		result = result[0];
	}

	return result;
}

/**
 * Compiles the given `selector`. The compiled selector can be passed to `perform`, `get`, and `set` instead of the original string.
 * If you intend to re-use a given selector for multiple operations, pre-compiling it gives a performance boost.
 *
 * The returned compiled selector also has methods `perform`, `get`, and `set`, so instead of calling `get(compiledSelector, obj)` you can
 * also do `compiledSelector.get(obj)`.
 * @param  {string} selector The selector to compile.
 * @return {Selector}          The compiled selector.
 */
export function compile(selector) {
	const result = parse(selector);

	// Allow using compiled selector in "object form", i.e. instead of enforcing
	// get(selector, obj) also allow selector.get(obj)
	result.perform = (...args) => perform(result, ...args);
	result.get = (...args) => get(result, ...args);
	result.set = (...args) => set(result, ...args);

	return result;
}

/**
 * This is the fundamental function used to manipulate object properties with selectors.
 * In its most basic form, it takes a selector `selector`, a function `fn` and a target object `obj` and applies `fn` to all properties
 * in `obj` described by `selector`. If the result of the function application is different form the property's current value,
 * it will be updated accordingly.
 *
 * `perform` returns the results of the function application. If the used `selector` is ambiguous, the results are returned as an array.
 * If it is unambiguous, the result is returned as a scalar. `options.collate` can be used to force one behavior or the other:
 * - Setting `options.collate` to `false` will _always_ return an array, even if there is only one result.
 * - Setting `options.collate` to `true` will check that all results are deeply equal, and if they are, return their value as a scalar.
 * If the results are not all deeply equal, an error will be thrown. (Note that the function will still have been applied, though.)
 *
 * _Note: In versions prior 2.0, this function was called `apply`. This has been changed to `perform` to avoid a name conflict with
 * `Function.prototype.apply` in compiled selectors._
 * @param  {string|Selector}   selector The selector describing the properties to perform the function to. This can either be a string, or
 * a {@link compile|pre-compiled selector}.
 * @param  {Function} fn       The function to perform.
 * @param  {Object}   obj      The object on whose properties to perform the function.
 * @param  {Object}   [options]  An optional object with further options for the operation
 * @param  {boolean}  [options.collate] Whether to collate the results or not. Defaults to `true` on unambiguous selectors, and to `false` on ambiguous ones.
 * @param  {'normal'|'strict'|'lenient'}	[options.mode='normal'] The parsing mode to use. In `normal` mode, it is permissible to select a non-existent property
 * as long as it is the terminal portion of the selector. I.e. it is permissible to select `'a'` on `{}`, but not `'a.b'`. This mode
 * mimics the ordinary rules of selecting object properties in Javascript (where `{}['a'] === undefined`).
 * In `strict` mode, any attempt to select a non-existent property immediately results in an error.
 * In `lenient` mode, non-existent properties are silently dropped.
 * The default mode is `normal`.
 * @param  {Object}  [options.references] The values for any references used in the selector.
 * @return {*}            The results of applying `fn` to all selected properties.
 */
export function perform(selector, fn, obj, options) {
	if (typeof selector !== 'function')
		selector = compile(selector);

	return _perform(selector, fn, obj, options);
}

/**
 * Gets the values of the properties described by `selector` from `obj`. No properties are changed.
 * Otherwise, this function follows the same rules as {@link perform}.
 * @param  {string|Selector}   selector The selector describing the properties to get. This can either be a string, or
 * a {@link compile|pre-compiled selector}.
 * @param  {Object}   obj      The object whose properties to get.
 * @param  {Object}   [options]  An optional object with further options for the operation. See {@link perform}.
 * @return {*}            The values of the selected properties.
 * @see perform
 */
export function get(selector, obj, options) {
	return perform(selector, x => x, obj, options);
}


/**
 * Sets the values of the properties described by `selector` from `obj` to `value`.
 * Otherwise, this function follows the same rules as {@link perform}.
 * @param  {string|Selector}   selector The selector describing the properties to set. This can either be a string, or
 * a {@link compile|pre-compiled selector}.
 * @param  {Object}   obj      The object whose properties to set.
 * @param  {*}		value		The new value for the properties.
 * @param  {Object}   [options]  An optional object with further options for the operation. See {@link perform}.
 * @return {*}            The new values of the selected properties. Unless collating, the length of the result gives an indication of
 * how many properties matched the selector.
 * @see perform
 */
export function set(selector, obj, value, options) {
	return perform(selector, () => value, obj, options);
}