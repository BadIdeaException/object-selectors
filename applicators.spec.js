"use strict";

import { perform, get, set, compile, CollationError } from './applicators.js';
import sinon from 'sinon';
import esmock from 'esmock';

describe('perform', function() {
	let obj;

	beforeEach(function() {
		obj = {
			a: { b1: { c: 0 }, b2: { c: 1 }}
		};
	});

	it('should call the function with all matching properties', function() {
		const fn = sinon.spy();

		perform('a.b*.c', fn, structuredClone(obj));

		expect(fn).to.have.been.calledTwice;
		expect(fn).to.have.been.calledWith(obj.a.b1.c);
		expect(fn).to.have.been.calledWith(obj.a.b2.c);
	});

	it('should set matching properties to the result value', function() {
		const fn = x => x + 1;
		const expected = structuredClone(obj);
		expected.a.b1.c = fn(obj.a.b1.c);
		expected.a.b2.c = fn(obj.a.b2.c);

		perform('a.b*.c', fn, obj);

		expect(obj).to.deep.equal(expected);
	});

	it('should not set properties that have not changed', function() {
		Object.freeze(obj.a.b1);
		Object.freeze(obj.a.b2);
		const fn = x => x;

		expect(perform.bind(null, 'a.b*.c', fn, obj)).to.not.throw();
	});

	it('should be callable with a string or a pre-compiled selector', function() {
		const selector = 'a.b*.c';
		expect(perform.bind(null, selector, x => x, obj)).to.not.throw();
		expect(perform.bind(null, compile(selector), x => x, obj)).to.not.throw();
	});

	describe('collation', function() {
		const fn = x => x + 1;

		it('should return a scalar result on an unambiguous selector when collation is not specified', function() {
			const expected = fn(obj.a.b1.c);

			expect(perform('a.b1.c', fn, obj)).to.equal(expected);
		});

		it('should return an array of all results on an ambiguous selector when collation is not specified', function() {
			const expected = [ obj.a.b1.c, obj.a.b2.c ].map(fn);

			expect(perform('a.b*.c', fn, obj)).to.deep.equal(expected);
		});

		it('should return an array on an unambiguous selector when collation is set to false', function() {
			const expected = [ obj.a.b1.c].map(fn);

			expect(perform('a.b1.c', fn, obj, { collate: false })).to.deep.equal(expected);
		});

		it('should return a scalar on an ambiguous selector when collation is set to true and all values are equal', function() {
			// Redefine so results will be equal
			const fn = () => 0;
			const expected = fn();

			expect(perform('a.b*.c', fn, obj, { collate: true })).to.equal(expected);
		});

		it('should throw when collating and not all results are equal', function() {
			expect(perform.bind(null, 'a.b*.c', fn, obj, { collate: true })).to.throw(CollationError);
		});
	});
});

describe('get', function() {
	let obj;
	beforeEach(function() {
		obj = {
			a: { b1: { c: 0 }, b2: { c: 1 }}
		};
	});

	it('should get all matching properties', function() {
		expect(get('a.b*.c', obj)).to.deep.equal([ obj.a.b1.c, obj.a.b2.c ]);
	});
});

describe('set', function() {
	let obj;
	beforeEach(function() {
		obj = {
			a: { b1: { c: 0 }, b2: { c: 1 }}
		};
	});

	it('should set all matching properties', function() {
		const c = 5;

		expect(set('a.b*.c', obj, c)).to.deep.equal([ c, c ]);
		expect(obj.a.b1.c).to.equal(c);
		expect(obj.a.b2.c).to.equal(c);
	});
});

describe('compile', function() {
	it('should return a selector function', function() {
		const selector = compile('a.b.c');
		expect(selector).to.be.a('function');
	});

	it('should have perform(), get(), and set() methods', function() {
		const selector = compile('a.b.c');

		expect(selector).itself.to.respondTo('perform');
		expect(selector).itself.to.respondTo('get');
		expect(selector).itself.to.respondTo('set');
	});

	it('should not re-parse the selector after pre-compiling', async function() {
		let parse = (await import('./selector.js')).parse;
		parse = sinon.stub().callsFake(parse);
		const { get, compile } = await esmock('./applicators.js', {
			'./selector.js': { parse }
		});

		const selector = compile('*');
		expect(parse).to.have.been.calledOnce;

		get(selector, {});
		// Call count should still be 1:
		expect(parse).to.have.been.calledOnce;
	});
});