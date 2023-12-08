import { parse } from './selector.js';

describe('Selector syntax', function() {
	const WILDCARDS = [ '*', '?' ];
	const OPERATORS = [ '==', '===', '^=', '$=', '~=', '<', '<=', '>=', '>' ];
	const ACCESSOR = '.';

	it('should allow the empty selector', function() {
		expect(parse.bind(null, '')).to.not.throw();
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
				'.', '[', ']', '=='
			];

			reserved.forEach(char =>
				expect(parse.bind(null, `a${char}`), char).to.throw()
			);
		});

		it('should not throw on escaped reserved characters in identifiers', function() {
			const reserved = [
				'.', '[', ']', '==', '*', '?'
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

	describe.skip('Selector Union', function() {
		it('should allow unioning selectors with a comma', function() {
			expect(parse.bind(null, 'a, b')).to.not.throw();
		});
	})
});

describe('Selector semantics', function() {
	const MODE_NORMAL = 0;
	const MODE_STRICT = 1;
	const MODE_LENIENT = 2;

	describe('Simple selectors', function() {
		it('should select the root object with an empty selector', function() {
			const key = '';
			const obj = {};

			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.deep.equals({ obj });
			expect(resolution[0]).to.have.property('selection').that.is.an('array').with.members([ 'obj' ]);
		});

		it('should select a property by name', function() {
			const key = 'a';
			const obj = {};

			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.is.an('array').with.members([ key ]);
		});
	});

	describe('Accessor selectors', function() {
		it('should change the targets to the selected properties', function() {
			const key = 'a.b';
			const obj = { a: {} };

			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj.a);
		});
	});

	describe('Wildcard selectors', function() {
		it('should select all properties with matching names (asterisk)', function() {
			const key = 'a*';
			const obj = { a1: {}, a2: {}, b: {}, abc: {} };

			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'a1', 'a2', 'abc' ]);
		});

		it('should select all properties with matching names (question mark)', function() {
			const key = 'a?';
			const obj = { a1: {}, a2: {}, b: {}, abc: {} };

			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'a1', 'a2' ]);
		});
	});

	describe('Conditional selectors', function() {
		it('should select with complex selectors in conditions', function() {
			const obj = {
				a1: {
					b: {
						c1: 0
					}
				},
				a2: {
					b: {
						cde: 1
					}
				},
				b: {},
				abc: {
					b: {
						cdef: 2
					}
				}
			};
			// Select all properties starting with the letter a that have a property b with a sub-property
			// starting with c and ending with f that has the value 2
			const key = 'a*[b.c*f == 2]';
			const resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'abc' ]);
		});

		it('should select only properties with a truthy value for a unary condition', function() {
			const key = 'a[b]';

			let obj = { a: { b: 1 } };

			// Condition satisfied:
			let resolution = parse(key)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'a' ]);

			// Condition not satisfied:
			obj.a.b = 0;
			resolution = parse(key)(obj);
			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.is.empty;
		});

		// The following tests are auto-generated to test all recognized condition operators.
		// The condition is generated as [b <operator> <value>].
		// A positive test is generated by setting obj.a.b to satisifed, a negative test is
		// generated by setting obj.a.b to violated.
		// If value is not supplied, it is set to the value of satisfied.
		// eslint-disable-next-line mocha/no-setup-in-describe
		[
			{ operator: '==', meaning: 'loosely equal to', satisfied: 1, violated: 2 },
			{ operator: '===', meaning: 'strictly equal to', satisfied: '1', violated: 1 },
			{ operator: '^=', meaning: 'beginning with', satisfied: 'xyz', violated: 'zyx', value: 'x' },
			{ operator: '$=', meaning: 'ending with', satisfied: 'xyz', violated: 'zyx', value: 'z' },
			{ operator: '~=', meaning: 'matching the regex of', satisfied: 'abba', violated: 'aa', value: 'ab\\+a' },
			{ operator: '<', meaning: 'strictly less than', satisfied: 'a', violated: 'b', value: 'b' },
			{ operator: '<=', meaning: 'less than or equal to', satisfied: 'a', violated: 'c', value: 'b' },
			{ operator: '>', meaning: 'strictly greater than', satisfied: 'c', violated: 'b', value: 'b' },
			{ operator: '>=', meaning: 'greater than or equal', satisfied: 'c', violated: 'a', value: 'b' },
		].forEach(({ operator, meaning, satisfied, violated, value }) =>
			it(`should select only properties with a value ${meaning} the value of the condition with ${operator}`, function() {
				value ??= satisfied;

				const key = `a[b ${operator} ${value}]`;

				let obj = { a: { b: satisfied } };

				// Condition satisfied:
				let resolution = parse(key)(obj);

				expect(resolution).to.be.an('array').with.lengthOf(1);
				expect(resolution[0]).to.have.property('target').that.equals(obj);
				expect(resolution[0]).to.have.property('selection').that.has.members([ 'a' ]);

				// Condition not satisfied:
				obj.a.b = violated;
				resolution = parse(key)(obj);
				expect(resolution).to.be.an('array').with.lengthOf(1);
				expect(resolution[0]).to.have.property('target').that.equals(obj);
				expect(resolution[0]).to.have.property('selection').that.is.empty;
			})
		);

		it('should replace the value in a reference value', function() {
			const references = { val: 'abc' };
			const obj = { a: { b: references.val }};

			const resolution = parse('a[b === @val]')(obj, references);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'a' ]);
		});
	});

	describe('Parsing modes', function() {
		describe('Normal mode', function() {
			it('should not throw when selecting a non-existing property that is the terminal part of its selector', function() {
				const parser = parse('a');
				expect(parser.bind(null, {}, null, MODE_NORMAL)).to.not.throw();
			});

			it('should throw when selecting a non-existing property that is an intermediate part of the selector', function() {
				expect(parse('a.b.c').bind(null, {}, null, MODE_NORMAL)).to.throw();

				// There is another, slightly more complex case here: when selecting a.b on {}, parse will actually NOT throw,
				// but return a resolution with an undefined target.
				// (Trying to work with that resolution however will invariable throw.)
				const parser = parse('a.b');
				expect(parser.bind(null, {}, null, MODE_NORMAL)).to.not.throw();

				const resolution = parser({}, null, MODE_NORMAL);
				expect(resolution).to.be.an('array').with.lengthOf(1);
				expect(resolution[0].target).to.not.exist;
			});
		});

		describe('Strict mode', function() {
			it('should throw an error when selecting a non-existing property', function() {
				expect(parse('a').bind(null, {}, null, MODE_STRICT)).to.throw();
			});

			it('should throw an error when no properties match a wildcard selector' , function() {
				expect(parse('a*').bind(null, {}, null, MODE_STRICT)).to.throw();
			});
		});

		describe('Lenient mode', function() {
			it('should ignore intermediate non-matches when selecting unambiguously', function() {
				expect(parse('a.b')({}, {}, MODE_LENIENT)).to.be.empty;
			});

			it('should silently discard intermediate non-matches when selecting with wildcards', function() {
				const obj = {
					a1: { b: { c: 1 }},
					a2: { not_b: { c: 2 }}
				}

				const parser = parse('a?.b.c');
				expect(parser.bind(null, obj, null, MODE_LENIENT)).to.not.throw();

				const resolution = parser(obj, null, MODE_LENIENT);
				expect(resolution).to.be.an('array').with.lengthOf(1);
				expect(resolution[0]).to.have.property('target').that.equals(obj.a1.b);
				expect(resolution[0]).to.have.property('selection').that.has.members([ 'c' ]);
			});
		});
	});

	describe.skip('Selector Union', function() {
		it('should return the concatenated results of all constituent selectors', function() {
			const selector1 = 'a1';
			const selector2 = 'a2';
			const selector = `${selector1}, ${selector2}`;

			const obj = { a1: {}, a2: {}, b: {}, abc: {} };


			const resolution = parse(selector)(obj);

			expect(resolution).to.be.an('array').with.lengthOf(1);
			expect(resolution[0]).to.have.property('target').that.equals(obj);
			expect(resolution[0]).to.have.property('selection').that.has.members([ 'a1, a2' ]);
		});
	});
});