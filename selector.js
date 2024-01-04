// Generated by Peggy 3.0.2.
//
// https://peggyjs.org/

function peg$subclass(child, parent) {
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  // istanbul ignore next Check is a necessary evil to support older environments
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}

peg$subclass(peg$SyntaxError, Error);

function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) { return str; }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
      ? this.location.source.offset(s)
      : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = (last - s.column) || 1;
      str += "\n --> " + loc + "\n"
          + filler + " |\n"
          + offset_s.line + " | " + line + "\n"
          + filler + " | " + peg$padEnd("", s.column - 1, ' ')
          + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part)
          ? classEscape(part[0]) + "-" + classEscape(part[1])
          : classEscape(part);
      });

      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },

    any: function() {
      return "any character";
    },

    end: function() {
      return "end of input";
    },

    other: function(expectation) {
      return expectation.description;
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/"/g,  "\\\"")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .replace(/\^/g, "\\^")
      .replace(/-/g,  "\\-")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  var peg$FAILED = {};
  var peg$source = options.grammarSource;

  var peg$startRuleFunctions = { Union_Selector: peg$parseUnion_Selector };
  var peg$startRuleFunction = peg$parseUnion_Selector;

  var peg$c0 = ",";
  var peg$c1 = ".";
  var peg$c2 = "[";
  var peg$c3 = "]";
  var peg$c4 = "===";
  var peg$c5 = "==";
  var peg$c6 = "$=";
  var peg$c7 = "^=";
  var peg$c8 = "~=";
  var peg$c9 = ">=";
  var peg$c10 = "<=";
  var peg$c11 = ">";
  var peg$c12 = "<";
  var peg$c13 = "@";
  var peg$c14 = "**";
  var peg$c15 = "*";
  var peg$c16 = "?";
  var peg$c17 = "+";
  var peg$c18 = "~";
  var peg$c19 = "\\";

  var peg$r0 = /^[A-Za-z0-9_]/;
  var peg$r1 = /^[ \t]/;

  var peg$e0 = peg$literalExpectation(",", false);
  var peg$e1 = peg$literalExpectation(".", false);
  var peg$e2 = peg$literalExpectation("[", false);
  var peg$e3 = peg$literalExpectation("]", false);
  var peg$e4 = peg$literalExpectation("===", false);
  var peg$e5 = peg$literalExpectation("==", false);
  var peg$e6 = peg$literalExpectation("$=", false);
  var peg$e7 = peg$literalExpectation("^=", false);
  var peg$e8 = peg$literalExpectation("~=", false);
  var peg$e9 = peg$literalExpectation(">=", false);
  var peg$e10 = peg$literalExpectation("<=", false);
  var peg$e11 = peg$literalExpectation(">", false);
  var peg$e12 = peg$literalExpectation("<", false);
  var peg$e13 = peg$literalExpectation("@", false);
  var peg$e14 = peg$literalExpectation("**", false);
  var peg$e15 = peg$literalExpectation("*", false);
  var peg$e16 = peg$literalExpectation("?", false);
  var peg$e17 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_"], false, false);
  var peg$e18 = peg$literalExpectation("+", false);
  var peg$e19 = peg$literalExpectation("~", false);
  var peg$e20 = peg$literalExpectation("\\", false);
  var peg$e21 = peg$otherExpectation("whitespace");
  var peg$e22 = peg$classExpectation([" ", "\t"], false, false);

  var peg$f0 = function(selectors) {
	return Object.assign(function union(obj, references, mode) {		
		return selectors.flatMap(select => select(obj, references, mode))
	}, {
		// The selector is ambiguous if it is a union of more than one selectors, 
		// or if there is only one selector and that selector is ambiguous itself
		ambiguous: selectors.length > 1 || selectors[0].ambiguous, 
		source: text()
	});
};
  var peg$f1 = function(head, tail) { 
		
		return [ 
			...head,  		// Spread operator: property descriptors are parsed as arrays (because they might include conditions)
			...tail.flat()	// Spread operator: the tail is an array of Accessor_selectors because of the asterisk operator
							// flat(): accessor selectors are themselves arrays as well (see their parse return value)
		]; 
	};
  var peg$f2 = function(selector) {
		// Return value is the function select, but we will set some meta-properties of the selector on it:
		// - Whether or not the selector is ambiguous
		// - The raw source text of the selector
		return Object.assign(function select(obj, references, mode) {
			const resolution = [
				{ target: obj, selection: [] }
			]
			selector?.forEach(element => element(resolution, references, mode));
			return resolution;
		}, { 
			// The selector as a whole is ambiguous if at least one of its constituents is ambiguous (multi-valued)
			ambiguous: selector.some(fn => fn.ambiguous),
			source: text()
		});
	};
  var peg$f3 = function() { return input === '' };
  var peg$f4 = function() {
		return Object.assign(function empty(obj) { 
			return [ { target: { obj }, selection: [ 'obj' ] } ];
		}, {
			ambiguous: false,
			source: text()
		});
	};
  var peg$f5 = function(accessor, property) { 
		return [ accessor, ...property ]
	};
  var peg$f6 = function() {
		return function access(resolution) {
			let result = [];
			for (let item of resolution) {
				result = result.concat(item.selection.map(property => ({
					target: item.target[property],
					selection: []
				})));
			}
			resolution.splice(0, resolution.length, ...result); // Work in-place
		}
	};
  var peg$f7 = function(property, condition) { 
		return [ 
			property, 
			...condition, 
			function validate(resolution, references, mode = MODE_NORMAL) {
				// Helper function that checks whether the target has a property of a given name
				// Returns false if the target is null or undefined or a primitive,
				// otherwise checks whether the property is an own OR INHERITED property
				// (accessor properties are defined on the prototype and would not be caught by hasOwnProperty)
				function hasProperty(tgt, prop) {
					if (!tgt) return false;
					else if (typeof tgt === 'object') return prop in tgt
					else return false;
				}
				if (mode) {
					// Run through the current resolutions backwards, because we may be changing them
					for (let i = resolution.length - 1; i >= 0; i--) {
						// There is an "invalid" resolution if
						// - no matching selections were found (see below)
						// - or a set selection does not exist on the target
						for (let j = resolution[i].selection.length - 1; j >= 0; j--) {
							if (!hasProperty(resolution[i].target, resolution[i].selection[j])) {
								switch(mode) {
									// In strict mode, throw an error
									case MODE_STRICT: throw new TypeError(`Object has no properties matching ${text()}`);
									// In lenient mode, remove the offending selection	
									case MODE_LENIENT: resolution[i].selection.splice(j, 1);
								}
							}
						}
						// If after removing all offending selections none are left, remove the entire resolution in lenient
						// mode or throw in strict mode
						if (resolution[i].selection.length === 0)
							switch (mode) {
								case MODE_STRICT: throw new TypeError(`Object has no properties matching ${text()}`)
								case MODE_LENIENT: resolution.splice(i, 1);
							}
					}
				}
			} 
		] 
	};
  var peg$f8 = function(regex) {
		// Wildcard selectors are always ambiguous
		return Object.assign(function selectByRegex(resolution, references, mode) {
			for (let item of resolution) {
				if (mode === MODE_LENIENT && item.target == null)
					item.selection = [];
				else
					item.selection = Object.keys(item.target).filter(key => regex.test(key));
			}
		}, { ambiguous: true });
	};
  var peg$f9 = function(name) {
		return function selectByName(resolution) {
			resolution.forEach(item => item.selection = [ name ]);
		}          
	};
  var peg$f10 = function(condition) {
		return function selectByCondition(resolution, references, mode) {
			const { selector, operator, valueFn } = condition;
			const value = valueFn(references);
			for (let item of resolution) 				
				item.selection = item.selection.filter(selectedProperty => {
					// Normalize condition selector from tuples (target, multiple selections) to 
					// (target, single selection)
					const conditionProperties = selector(item.target[selectedProperty], references, mode)
						.flatMap(({ target, selection }) => selection.map(conditionProperty => ({ target, conditionProperty })));

					return conditionProperties.length > 0 && conditionProperties.every(({ target, conditionProperty }) => operator(target[conditionProperty], value));
				});
		}
	};
  var peg$f11 = function(selector) {
		return { selector, operator: Boolean, valueFn: () => null };
	};
  var peg$f12 = function(selector, operator, valueFn) {     	
		if (operator.name === '~=') {
			let _valueFn = valueFn;
			valueFn = references => new RegExp(_valueFn(references));
		}		
		return { selector, operator, valueFn };
	};
  var peg$f13 = function(operator) {
		return {
			'==': (a,b) => a == b,
			'===': (a,b) => a === b,
			'$=': (a,b) => a?.endsWith(b),
			'^=': (a,b) => a?.startsWith(b),
			'~=': (a,b) => b.test(a),
			'>': (a,b) => a > b,
			'>=': (a,b) => a >= b,
			'<=': (a,b) => a <= b,
			'<': (a,b) => a < b
		}[operator];
	};
  var peg$f14 = function(reference) {
		// Return a function that resolves the reference against the passed references object
		return references => references[reference];
	};
  var peg$f15 = function(identifier) { 
		// Return a constant function that returns identifier, so as to present the same interface as a reference value
		return () => identifier; 
	};
  var peg$f16 = function(symbols) { return symbols.join(''); };
  var peg$f17 = function(descriptor) { return new RegExp('^' + descriptor.flat(Infinity).join('') + '$') };
  var peg$f18 = function(wildcard) {
		switch (wildcard) {
			case '*': return '\\w*';
			case '?': return '\\w';
		}
	};
  var peg$f19 = function(char) { return char; };
  var peg$f20 = function() { return; };
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = 0;
  var peg$maxFailExpected = [];
  var peg$silentFails = 0;

  var peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos, offset) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);

    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset && peg$source && (typeof peg$source.offset === "function")) {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseUnion_Selector() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    s3 = peg$parseSelector();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$currPos;
      s4 = peg$currPos;
      s5 = [];
      s6 = peg$parse_();
      while (s6 !== peg$FAILED) {
        s5.push(s6);
        s6 = peg$parse_();
      }
      s6 = peg$parseUnion_Operator();
      if (s6 !== peg$FAILED) {
        s7 = [];
        s8 = peg$parse_();
        while (s8 !== peg$FAILED) {
          s7.push(s8);
          s8 = peg$parse_();
        }
        s5 = [s5, s6, s7];
        s4 = s5;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s4 = peg$parseSelector();
        if (s4 === peg$FAILED) {
          peg$currPos = s3;
          s3 = peg$FAILED;
        } else {
          s3 = s4;
        }
      } else {
        s3 = s4;
      }
    }
    if (s2.length < 1) {
      peg$currPos = s1;
      s1 = peg$FAILED;
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f0(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseUnion_Operator() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 44) {
      s0 = peg$c0;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e0); }
    }

    return s0;
  }

  function peg$parseSelector() {
    var s0, s1, s2, s3, s4;

    s0 = peg$parseEmpty_selector();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseProperty_descriptor();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseAccessor_selector();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseAccessor_selector();
        }
        peg$savedPos = s1;
        s1 = peg$f1(s2, s3);
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f2(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseEmpty_selector() {
    var s0, s1;

    s0 = peg$currPos;
    peg$savedPos = peg$currPos;
    s1 = peg$f3();
    if (s1) {
      s1 = undefined;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f4();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseAccessor_selector() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseAccessor();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseProperty_descriptor();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f5(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAccessor() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 46) {
      s1 = peg$c1;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e1); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f6();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseProperty_descriptor() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseProperty_name();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseCondition();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseCondition();
      }
      peg$savedPos = s0;
      s0 = peg$f7(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseProperty_name() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseProperty_name_with_wildcard();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f8(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f9(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseCondition() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s1 = peg$c2;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e2); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parse_();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parse_();
      }
      s3 = peg$parseUnaryCondition();
      if (s3 === peg$FAILED) {
        s3 = peg$parseBinaryCondition();
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parse_();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
        if (input.charCodeAt(peg$currPos) === 93) {
          s5 = peg$c3;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f10(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseUnaryCondition() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$parseBinaryCondition();
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = undefined;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseSelector();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f11(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBinaryCondition() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseSelector();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parse_();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parse_();
      }
      s3 = peg$parseOperator();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parse_();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
        s5 = peg$parseValue();
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f12(s1, s3, s5);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseOperator() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c4) {
      s1 = peg$c4;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e4); }
    }
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c5) {
        s1 = peg$c5;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e5); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c6) {
          s1 = peg$c6;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c7) {
            s1 = peg$c7;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e7); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c8) {
              s1 = peg$c8;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e8); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c9) {
                s1 = peg$c9;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c10) {
                  s1 = peg$c10;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e10); }
                }
                if (s1 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 62) {
                    s1 = peg$c11;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e11); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 60) {
                      s1 = peg$c12;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e12); }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f13(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseValue() {
    var s0;

    s0 = peg$parseReferenceValue();
    if (s0 === peg$FAILED) {
      s0 = peg$parseLiteralValue();
    }

    return s0;
  }

  function peg$parseReferenceValue() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseReference_character();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseIdentifier();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f14(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseReference_character() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 64) {
      s0 = peg$c13;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }

    return s0;
  }

  function peg$parseLiteralValue() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseIdentifier();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f15(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseIdentifier() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseSymbol();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseSymbol();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f16(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseProperty_name_with_wildcard() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$currPos;
    s3 = peg$parseIdentifier();
    if (s3 === peg$FAILED) {
      s3 = null;
    }
    s4 = peg$parseWildcard();
    if (s4 !== peg$FAILED) {
      s3 = [s3, s4];
      s2 = s3;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    peg$silentFails--;
    if (s2 !== peg$FAILED) {
      peg$currPos = s1;
      s1 = undefined;
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parseWildcard();
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s4 = [];
      s5 = peg$currPos;
      s6 = peg$parseIdentifier();
      if (s6 !== peg$FAILED) {
        s7 = peg$parseWildcard();
        if (s7 === peg$FAILED) {
          s7 = null;
        }
        s6 = [s6, s7];
        s5 = s6;
      } else {
        peg$currPos = s5;
        s5 = peg$FAILED;
      }
      while (s5 !== peg$FAILED) {
        s4.push(s5);
        s5 = peg$currPos;
        s6 = peg$parseIdentifier();
        if (s6 !== peg$FAILED) {
          s7 = peg$parseWildcard();
          if (s7 === peg$FAILED) {
            s7 = null;
          }
          s6 = [s6, s7];
          s5 = s6;
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
      }
      s5 = peg$parseWildcard();
      if (s5 === peg$FAILED) {
        s5 = null;
      }
      s3 = [s3, s4, s5];
      s2 = s3;
      peg$savedPos = s0;
      s0 = peg$f17(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseWildcard() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    if (input.substr(peg$currPos, 2) === peg$c14) {
      s2 = peg$c14;
      peg$currPos += 2;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e14); }
    }
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = undefined;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 42) {
        s2 = peg$c15;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e15); }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 63) {
          s2 = peg$c16;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e16); }
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f18(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsePermitted_character() {
    var s0;

    if (peg$r0.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e17); }
    }

    return s0;
  }

  function peg$parseReserved_character() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseAccessor();
    if (s1 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c17;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e18); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 126) {
          s1 = peg$c18;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e19); }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c2;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e2); }
          }
          if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s1 = peg$c3;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e3); }
            }
            if (s1 === peg$FAILED) {
              s1 = peg$parseWildcard();
              if (s1 === peg$FAILED) {
                s1 = peg$parseEscape_character();
                if (s1 === peg$FAILED) {
                  s1 = peg$parseReference_character();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseOperator();
                    if (s1 === peg$FAILED) {
                      s1 = peg$parseUnion_Operator();
                      if (s1 === peg$FAILED) {
                        s1 = peg$parse_();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parseEscape_character() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 92) {
      s0 = peg$c19;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e20); }
    }

    return s0;
  }

  function peg$parseSymbol() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseEscape_character();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseReserved_character();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f19(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePermitted_character();
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$currPos;
    if (peg$r1.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e22); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f20();
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e21); }
    }

    return s0;
  }


	const MODE_NORMAL = 0;
	const MODE_STRICT = 1;
	const MODE_LENIENT = 2;

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

export {
  peg$SyntaxError as SyntaxError,

  peg$parse as parse
};
