import { parse } from './selector.js';
import sinon from 'sinon';

describe('Selector syntax', function() {
	const WILDCARDS = [ '*', '?' ];
	const OPERATORS = [ '==', '===', '!=', '!==', '^=', '$=', '~=', '<', '<=', '>=', '>' ];
	const ACCESSOR = '.';

	describe('Empty selector', function() {
		beforeEach(function() {
			sinon.stub(console, 'warn');
		});

		afterEach(function() {
			console.warn.restore();
		});

		it('should allow the empty selector', function() {
			expect(parse.bind(null, '')).to.not.throw();
		});

		it('should issue a deprecation warning', function() {
			parse('');
			expect(console.warn).to.have.been.calledWith(sinon.match(/deprecated/));
		});
	});

	describe('Accessor selectors', function() {
		it('should allow accessor chains', function() {
			expect(parse.bind(null, `a${ACCESSOR}b`)).to.not.throw();
		});

		it('should not allow dangling accessors', function() {
			expect(parse.bind(null, `a${ACCESSOR}`)).to.throw();
		});
	});

	describe('Identifiers', function() {
		it('should throw on unescaped reserved characters in identifiers', function() {
			const reserved = [
				'.', '[', ']', ...OPERATORS, ',', ' ', ':'
			];

			reserved.forEach(char =>
				expect(parse.bind(null, `a${char}`), char).to.throw()
			);
		});

		it('should not throw on escaped reserved characters in identifiers', function() {
			const reserved = [
				'.', '[', ']', ...OPERATORS, '*', '?', ':'
			];

			reserved.forEach(char =>
				expect(parse.bind(null, `a\\${char}`), char).to.not.throw()
			);
		});
	});

	describe('Wildcards', function() {
		it('should allow wildcards in selectors', function() {
			WILDCARDS.forEach(wildcard => expect(parse.bind(null, `${wildcard}b`), `${wildcard} at the start`).to.not.throw());
			WILDCARDS.forEach(wildcard => expect(parse.bind(null, `a${wildcard}`), `${wildcard} at the end`).to.not.throw());
			WILDCARDS.forEach(wildcard => expect(parse.bind(null, `a${wildcard}b`), `${wildcard} in the middle`).to.not.throw());
		});

		it('should allow wildcard-only selectors', function() {
			WILDCARDS.forEach(wildcard => expect(parse.bind(null, wildcard), wildcard).to.not.throw());
		});

		it('should allow double wildcards except double asterisks', function() {
			[ '*?', '?*', '??' ].forEach(combination => expect(parse.bind(null, combination), combination).to.not.throw());
			expect(parse.bind(null, '**'), '**').to.throw();
		});
	});

	describe('Pseudo elements', function() {
		it('should allow ::root', function() {
			expect(parse.bind(null, '::root')).to.not.throw();
		});

		it('should allow ::first and ::last', function() {
			expect(parse.bind(null, '::first')).to.not.throw();
			expect(parse.bind(null, '::last')).to.not.throw();
		});
	});

	describe('Conditions', function() {
		it('should allow unary conditions', function() {
			expect(parse.bind(null, 'a[b]')).to.not.throw();
		});

		it('should allow binary conditions with only the recognized operators', function() {
			OPERATORS.forEach(operator =>
				expect(parse.bind(null, `a[b ${operator} c]`)).to.not.throw()
			);
			expect(parse.bind(null, `a[b ?= c]`)).to.throw();
		});

		it('should not allow empty conditions or ones missing the closing bracket', function() {
			expect(parse.bind(null, 'a[]')).to.throw();
			expect(parse.bind(null, 'a[b')).to.throw();
		});

		it('should allow whitespace in conditions', function() {
			expect(parse.bind(null, 'a[ b == c ]')).to.not.throw();
		});

		it('should allow complex selectors in conditions', function() {
			expect(parse.bind(null, 'a[b.c*.0 == c]')).to.not.throw();
		});

		it('should allow multiple conditions', function() {
			expect(parse.bind(null, 'a[b][c]')).to.not.throw();
		});
	});

	describe('Selector Union', function() {
		it('should allow unioning selectors with a comma', function() {
			expect(parse.bind(null, 'a.b.c, x.y.z')).to.not.throw();
		});
	});
});