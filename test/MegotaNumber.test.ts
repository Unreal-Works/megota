/// <reference types="../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../src/MegotaNumber';

describe('configurations', () => {
    it('should change maxOps when set', () => {
        const originalMaxOps = MegotaNumber.maxOps;
        MegotaNumber.maxOps = 50;
        expect(MegotaNumber.maxOps).toBe(50);
        MegotaNumber.maxOps = originalMaxOps;
    });

    it('should change serializeMode when set', () => {
        const originalMode = MegotaNumber.serializeMode;
        MegotaNumber.serializeMode = 1;
        expect(MegotaNumber.serializeMode).toBe(1);
        MegotaNumber.serializeMode = originalMode;
    });
});

describe('construction', () => {
    it('should create a MegotaNumber from number', () => {
        const num = MegotaNumber.fromNumber(5);
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(5);
        expect(num.layer).toBe(0);
    });

    it('should create a MegotaNumber from negative number', () => {
        const num = MegotaNumber.fromNumber(-10);
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBe(10);
    });

    it('should create a MegotaNumber from string', () => {
        const num = MegotaNumber.fromString("5");
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(5);
    });

    it('should handle zero correctly', () => {
        const num = MegotaNumber.fromNumber(0);
        expect(num.sign).toBe(1);
        expect(num.array).toEqual([[0, 0, 0]]);
    });

    it('should handle NaN values', () => {
        const num = MegotaNumber.fromNumber(NaN);
        expect(isNaN(num.array[0][2])).toBe(true);
    });

    it('should handle infinity correctly', () => {
        const posInf = MegotaNumber.fromNumber(Infinity);
        expect(posInf.array[0][2]).toBe(Infinity);

        const negInf = MegotaNumber.fromNumber(-Infinity);
        expect(negInf.array[0][2]).toBe(Infinity);
        expect(negInf.sign).toBe(-1);
    });
});

describe('fromString', () => {
    it('should parse scientific notation', () => {
        const num = MegotaNumber.fromString("1.23e5");
        expect(num.array[0][2]).toBeCloseTo(123000);
    });

    it('should handle negative signs in strings', () => {
        const num = MegotaNumber.fromString("-5.678");
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBeCloseTo(5.678);
    });

    it('should parse special strings', () => {
        const nan = MegotaNumber.fromString("NaN");
        expect(isNaN(nan.array[0][2])).toBe(true);

        const inf = MegotaNumber.fromString("Infinity");
        expect(inf.array[0][2]).toBe(Infinity);
    });

    it('should handle scientific notation in various formats', () => {
        const cases = [
            { input: '1.23E45', expected: 45.089905111 },
            { input: '1.23e+45', expected: 45.089905111 },
            { input: '1.23e-5', expected: 0.0000123 },
            { input: '1E10', expected: 10000000000 },
            { input: '1e10', expected: 10000000000 }
        ];

        cases.forEach(({ input, expected }) => {
            const num = MegotaNumber.fromString(input);
            expect(num.array[0][2]).toBeCloseTo(expected, expected < 1 ? 8 : 0);
        });
    });

    it('should handle parsing of special notation formats', () => {
        const num1 = MegotaNumber.fromString('10^10');
        expect(num1.array[0][2]).toBe(10000000000);

        const num2 = MegotaNumber.fromString('10{1,2}5');
        expect(num2.array[0][2]).toBeGreaterThan(0);

        const num3 = MegotaNumber.fromString('N10');
        expect(num3.greaterThan(MegotaNumber.fromString('N9'))).toBe(true);

        const num4 = MegotaNumber.fromString('N^3 10');
        expect(num4).toBeGreaterThanMegota(MegotaNumber.fromString('N^2 10'));
        expect(num4).toBeGreaterThanMegota(MegotaNumber.fromString('N^3 9'));
    });

    it('should handle malformed inputs', () => {
        const num = MegotaNumber.fromString('not a number');
        expect(isNaN(num.array[0][2])).toBe(true);
    });

    it('should handle JSON format inputs', () => {
        const original = MegotaNumber.fromNumber(42);
        expect(MegotaNumber.fromJSON(original.toJSON())).toEqualMegota(original);
    });
});

describe('fromJSON and fromObject methods', () => {
    it('should correctly parse JSON objects', () => {
        const original = MegotaNumber.fromNumber(42);
        const json = original.toJSON();

        expect(MegotaNumber.fromJSON(json)).toEqualMegota(original);
    });

    it('should handle invalid JSON', () => {
        expect(() => MegotaNumber.fromJSON('{invalid}')).toThrow();
    });

    it('should handle null objects', () => {
        const result = MegotaNumber.fromObject(null);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should throw for non-object inputs', () => {
        expect(() => MegotaNumber.fromObject('not an object')).toThrow(TypeError);
    });

    it('should throw for objects with invalid array property', () => {
        expect(() => MegotaNumber.fromObject({ array: 'not an array' })).toThrow(TypeError);
    });

    it('should throw for objects with invalid sign property', () => {
        expect(() => MegotaNumber.fromObject({ array: [[0, 0, 0]], sign: 'not a number' })).toThrow(TypeError);
    });

    it('should throw for objects with invalid layer property', () => {
        expect(() => MegotaNumber.fromObject({ array: [[0, 0, 0]], sign: 1, layer: 'not a number' })).toThrow(TypeError);
    });
});

describe('fromOmegaNum method', () => {
    it('should create from OmegaNum-style array', () => {
        const result = MegotaNumber.fromOmegaNum([5, 3]); // 10^(10^(10^5)) = ee100000
        const ten = MegotaNumber.fromNumber(10);
        const expected = ten.pow(ten.pow(ten.pow(MegotaNumber.fromNumber(5))));
        expect(result).toEqualMegota(expected);
    });

    it('should handle empty arrays', () => {
        const num = MegotaNumber.fromOmegaNum([]);
        expect(num.equals(MegotaNumber.fromNumber(0))).toBe(true);
    });
});

describe('fromExpantaNum method', () => {
    it('should create from ExpantaNum-style array', () => {
        const num = MegotaNumber.fromExpantaNum([[0, 5]]);
        expect(num).toEqualMegota(MegotaNumber.fromNumber(5));
    });

    it('should handle empty arrays', () => {
        const num = MegotaNumber.fromExpantaNum([]);
        expect(num).toEqualMegota(MegotaNumber.fromNumber(0));
    });
});

describe('log10LongString method', () => {
    it('should calculate log10 for long strings', () => {
        // We can't directly test private method, so test it via fromString
        const num = MegotaNumber.fromString('1' + '0'.repeat(100)); // 1 followed by 100 zeros
        expect(num.array[0][2]).toBeCloseTo(100);
    });
});

describe('clone method', () => {
    it('should create an identical but separate copy', () => {
        const original = MegotaNumber.fromNumber(42);
        const clone = original.clone();

        expect(clone).toEqualMegota(original);

        // Modify clone and check that original is unchanged
        clone.array[0][2] = 43;
        expect(original.array[0][2]).toBe(42);
    });
});

describe('normalize method', () => {
    it('should normalize the internal array representation', () => {
        const num = new MegotaNumber();
        num.array = [[0, 0, 0], [0, 0, 0]]; // Redundant entry
        num.normalize();
        expect(num.array.length).toBe(1);
    });
});

describe('serialization', () => {
    it('should serialize to JSON and parse back correctly', () => {
        const original = MegotaNumber.fromNumber(42);
        const json = original.toJSON();
        const parsed = MegotaNumber.fromJSON(json);

        expect(parsed).toEqualMegota(original);
    });

    it('should serialize to JSON in correct format based on serializeMode', () => {
        const num = MegotaNumber.fromNumber(42);

        // Default mode (0) - return the object
        expect(num.toJSON()).toContain('"sign":1');
        expect(num.toJSON()).toContain('"array"');

        // String mode (1)
        const originalMode = MegotaNumber.serializeMode;
        MegotaNumber.serializeMode = 1;
        expect(num.toJSON()).toBe('42');

        MegotaNumber.serializeMode = originalMode; // Restore
    });
});

describe('comparison', () => {
    it('should compare numbers correctly using equals', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const c = MegotaNumber.fromNumber(5);
        const d = MegotaNumber.fromNumber(-5);

        expect(a).toEqualMegota(c);
        expect(a).not.toEqualMegota(b);
        expect(a).not.toEqualMegota(d);
    });

    it('should compare numbers correctly using compareTo', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const c = MegotaNumber.fromNumber(5);
        const d = MegotaNumber.fromNumber(-5);

        expect(a.compareTo(b)).toEqual(-1);
        expect(a.compareTo(c)).toEqual(0);
        expect(d.compareTo(a)).toEqual(-1);
    });

    it('should handle greaterThan and greaterThanOrEquals', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const c = MegotaNumber.fromNumber(5);

        expect(b).toBeGreaterThanMegota(a);
        expect(a).not.toBeGreaterThanMegota(b);
        expect(a).toBeGreaterThanOrEqualMegota(c);
        expect(a).not.toBeGreaterThanOrEqualMegota(b);
    });

    it('should identify NaN and finite values', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        const inf = MegotaNumber.fromNumber(Infinity);
        const normal = MegotaNumber.fromNumber(42);

        expect(nan.isNaN()).toBe(true);
        expect(inf.isNaN()).toBe(false);
        expect(normal.isNaN()).toBe(false);

        expect(nan.isFinite()).toBe(false);
        expect(inf.isFinite()).toBe(false);
        expect(normal.isFinite()).toBe(true);
    });
});

describe('configuration changes', () => {
    it('should respect maxOps limit', () => {
        const originalMaxOps = MegotaNumber.maxOps;
        MegotaNumber.maxOps = 5;

        // Create a number that would exceed maxOps
        const complexNum = MegotaNumber.fromString("10^10^10^10^10^10");

        // Verify the operations were limited
        expect(complexNum.array.length).toBeLessThanOrEqual(MegotaNumber.maxOps);

        // Restore original maxOps
        MegotaNumber.maxOps = originalMaxOps;
    });
});

describe('additional and subtraction', () => {
    it('should add small positive numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const result = a.add(b);

        expect(result.array[0][2]).toBe(15);
        expect(result.sign).toBe(1);
    });

    it('should add small negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-10);
        const result = a.add(b);

        expect(result.array[0][2]).toBe(5);
        expect(result.sign).toBe(-1);
    });

    it('should add positive and negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-3);
        const result = a.add(b);

        expect(result.array[0][2]).toBe(2);
        expect(result.sign).toBe(1);
    });

    it('should add large positive numbers', () => {
        const a = MegotaNumber.fromString("1.5e1000");
        const b = MegotaNumber.fromString("2.2e1000");
        const result = a.add(b);
        const expected = MegotaNumber.fromString("3.7e1000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should add large negative numbers', () => {
        const a = MegotaNumber.fromString("-5.5e1000");
        const b = MegotaNumber.fromString("-2.2e1000");
        const result = a.add(b);
        const expected = MegotaNumber.fromString("-7.7e1000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should add very large numbers', () => {
        const a = MegotaNumber.fromString("1e10000");
        const b = MegotaNumber.fromString("4e10000");
        const result = a.add(b);
        const expected = MegotaNumber.fromString("5e10000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should subtract very large numbers', () => {
        const a = MegotaNumber.fromString("1e10000");
        const b = MegotaNumber.fromString("4e10000");
        const result = a.sub(b);
        const expected = MegotaNumber.fromString("-3e10000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should add positive and negative large numbers', () => {
        const a = MegotaNumber.fromString("1.5e1000");
        const b = MegotaNumber.fromString("-2.2e1000");
        const result = a.add(b);
        const expected = MegotaNumber.fromString("-0.7e1000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should add extremely large numbers', () => {
        const a = MegotaNumber.fromString("J2");
        const b = MegotaNumber.fromString("J2");
        const result = a.add(b);
        const expected = MegotaNumber.fromString("J2");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should handle zero sum with small numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-5);
        const result = a.add(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle zero sum with very large numbers', () => {
        const a = MegotaNumber.fromString("1e10000");
        const b = MegotaNumber.fromString("-1e10000");
        const result = a.add(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should add zero correctly', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(0);
        const result = a.add(b);

        expect(result.array[0][2]).toBe(5);
        expect(result.sign).toBe(1);
    });

    it('should handle addition with NaN', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(NaN);
        const result = a.add(b);

        expect(result.isNaN()).toBe(true);
    });
});

describe('multiplication and division', () => {
    it('should multiply small positive numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const result = a.mul(b);

        expect(result).toEqualMegota(MegotaNumber.fromNumber(50));
    });

    it('should multiply small negative numbers', () => {
        const a = MegotaNumber.fromNumber(-5);
        const b = MegotaNumber.fromNumber(-10);
        const result = a.mul(b);

        expect(result).toEqualMegota(MegotaNumber.fromNumber(50));
    });

    it('should multiply positive and negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-3);
        const result = a.mul(b);

        expect(result).toEqualMegota(MegotaNumber.fromNumber(-15));
    });

    it('should multiply large positive numbers', () => {
        const a = MegotaNumber.fromString("1.5e1000");
        const b = MegotaNumber.fromString("2.2e1000");
        const result = a.mul(b);
        const expected = MegotaNumber.fromString("3.3e2000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should multiply large negative numbers', () => {
        const a = MegotaNumber.fromString("-5.5e1000");
        const b = MegotaNumber.fromString("-2.2e1000");
        const result = a.mul(b);
        const expected = MegotaNumber.fromString("12.1e2000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should multiply very large numbers', () => {
        const a = MegotaNumber.fromString("1e10000");
        const b = MegotaNumber.fromString("4e10000");
        const result = a.mul(b);
        const expected = MegotaNumber.fromString("4e20000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should multiply very large negative numbers', () => {
        const a = MegotaNumber.fromString("-2e10000");
        const b = MegotaNumber.fromString("-3e10000");
        const result = a.mul(b);
        const expected = MegotaNumber.fromString("6e20000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should multiply small numbers with large numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromString("1e1000");
        const result = a.mul(b);
        const expected = MegotaNumber.fromString("5e1000");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should divide very large numbers', () => {
        const a = MegotaNumber.fromString("1e10000");
        const b = MegotaNumber.fromString("4e10000");
        const result = a.div(b);
        const expected = MegotaNumber.fromString("0.25e0");
        expect(result).toBeCloseToMegota(expected);
    });

    it('should handle division by zero', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(0);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(Infinity));
    });

    it('should handle multiplication by zero', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(0);
        const result = a.mul(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle division by one', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(1);
        const result = a.div(b);
        expect(result).toEqualMegota(a);
    });

    it('should handle multiplication by one', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(1);
        const result = a.mul(b);
        expect(result).toEqualMegota(a);
    });

    it('should handle division by negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-2);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-2.5));
    });

    it('should handle multiplication by negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-2);
        const result = a.mul(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-10));
    });

    it('should handle multiplication with NaN', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(NaN);
        const result = a.mul(b);
        expect(result.isNaN()).toBe(true);
    });

    it('should handle division by NaN', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(NaN);
        const result = a.div(b);
        expect(result.isNaN()).toBe(true);
    });
});

describe('exponentiation', () => {
    it('should exponentiate small numbers', () => {
        const a = MegotaNumber.fromNumber(2);
        const b = MegotaNumber.fromNumber(3);
        const result = a.pow(b);

        expect(result).toEqualMegota(MegotaNumber.fromNumber(8));
    });

    it('should exponentiate large numbers', () => {
        const a = MegotaNumber.fromString("2e1000");
        const b = MegotaNumber.fromString("50");
        const result = a.pow(b);
        const expected = MegotaNumber.fromString("1.125899906842624e50015"); // 2^50 = 1125899906842624
        expect(result).toBeCloseToMegota(expected);
    });

    it('should handle exponentiation with zero base', () => {
        const a = MegotaNumber.fromNumber(0);
        const b = MegotaNumber.fromNumber(5);
        const result = a.pow(b);

        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle zero exponent', () => {
        const a = MegotaNumber.fromNumber(5);
        const result = a.pow(MegotaNumber.fromNumber(0));
        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle one exponent', () => {
        const a = MegotaNumber.fromNumber(5);
        const result = a.pow(MegotaNumber.fromNumber(1));
        expect(result).toEqualMegota(a);
    });

    it('should handle negative exponents', () => {
        const a = MegotaNumber.fromNumber(2);
        const b = MegotaNumber.fromNumber(-3);
        const result = a.pow(b);

        expect(result).toEqualMegota(MegotaNumber.fromString("0.125"));
    });

    it('should handle NaN base with exponentiation', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const b = MegotaNumber.fromNumber(2);
        const result = a.pow(b);

        expect(result.isNaN()).toBe(true);
    });

    it('should handle NaN exponent with exponentiation', () => {
        const a = MegotaNumber.fromNumber(2);
        const b = MegotaNumber.fromNumber(NaN);
        const result = a.pow(b);

        expect(result.isNaN()).toBe(true);
    });
});

describe('exp', () => {
    it('should calculate exp for small numbers', () => {
        const a = MegotaNumber.fromNumber(1);
        const result = a.exp();

        expect(result).toBeCloseToMegota(MegotaNumber.fromString("2.718281828459045"));
    });

    it('should calculate exp for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.exp();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("1.97e434"));
    });

    it('should handle exp of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.exp();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle exp of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-1);
        const result = a.exp();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("0.36787944117144233"));
    });

    it('should handle NaN in exp', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.exp();
        expect(result.isNaN()).toBe(true);
    });
});

describe('log', () => {
    it('should calculate log for small numbers', () => {
        const a = MegotaNumber.fromNumber(10);
        const result = a.log();

        expect(result).toBeCloseToMegota(MegotaNumber.fromString("2.302585092994046"));
    });

    it('should calculate log for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.log();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("6.907755278982137"));
    });

    it('should handle log of one', () => {
        const a = MegotaNumber.fromNumber(1);
        const result = a.log();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle log of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.log();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-Infinity));
    });

    it('should handle log of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-10);
        const result = a.log();
        expect(result.isNaN()).toBe(true);
    });

    it('should handle NaN in log', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.log();
        expect(result.isNaN()).toBe(true);
    });
});

describe('ln', () => {
    it('should calculate natural log for small numbers', () => {
        const a = MegotaNumber.fromNumber(Math.E);
        const result = a.ln();

        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should calculate natural log for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.ln();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("6.907755278982137"));
    });

    it('should handle ln of one', () => {
        const a = MegotaNumber.fromNumber(1);
        const result = a.ln();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle ln of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.ln();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-Infinity));
    });

    it('should handle ln of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-10);
        const result = a.ln();
        expect(result.isNaN()).toBe(true);
    });

    it('should handle NaN in ln', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.ln();
        expect(result.isNaN()).toBe(true);
    });
});

describe('log10', () => {
    it('should calculate log10 for small numbers', () => {
        const a = MegotaNumber.fromNumber(100);
        const result = a.log10();

        expect(result).toEqualMegota(MegotaNumber.fromNumber(2));
    });

    it('should calculate log10 for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.log10();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("3"));
    });

    it('should handle log10 of one', () => {
        const a = MegotaNumber.fromNumber(1);
        const result = a.log10();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle log10 of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.log10();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-Infinity));
    });

    it('should handle log10 of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-100);
        const result = a.log10();
        expect(result.isNaN()).toBe(true);
    });

    it('should handle NaN in log10', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.log10();
        expect(result.isNaN()).toBe(true);
    });
});

describe('sqrt', () => {
    it('should calculate square root for small numbers', () => {
        const a = MegotaNumber.fromNumber(4);
        const result = a.sqrt();

        expect(result).toEqualMegota(MegotaNumber.fromNumber(2));
    });

    it('should calculate square root for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.sqrt();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("31.622776601683793"));
    });

    it('should handle square root of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.sqrt();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle square root of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-4);
        const result = a.sqrt();
        expect(result.isNaN()).toBe(true);
    });

    it('should handle NaN in sqrt', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.sqrt();
        expect(result.isNaN()).toBe(true);
    });
});

describe('cbrt', () => {
    it('should calculate cube root for small numbers', () => {
        const a = MegotaNumber.fromNumber(8);
        const result = a.cbrt();

        expect(result).toEqualMegota(MegotaNumber.fromNumber(2));
    });

    it('should calculate cube root for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.cbrt();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("10"));
    });

    it('should handle cube root of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.cbrt();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle cube root of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-8);
        const result = a.cbrt();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-2));
    });

    it('should handle NaN in cbrt', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.cbrt();
        expect(result.isNaN()).toBe(true);
    });
});

describe('root', () => {
    it('should calculate nth root for small numbers', () => {
        const a = MegotaNumber.fromNumber(16);
        const result = a.root(MegotaNumber.fromNumber(4));

        expect(result).toEqualMegota(MegotaNumber.fromNumber(2));
    });

    it('should calculate nth root for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.root(MegotaNumber.fromNumber(3));
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("10"));
    });

    it('should handle nth root of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.root(MegotaNumber.fromNumber(3));
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle nth root of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-16);
        const result = a.root(MegotaNumber.fromNumber(4));
        expect(result.isNaN()).toBe(true); // Even root of negative number is NaN
    });

    it('should handle nth root of negative numbers with odd roots', () => {
        const a = MegotaNumber.fromNumber(-27);
        const result = a.root(MegotaNumber.fromNumber(3));
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-3));
    });

    it('should handle NaN in root', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.root(MegotaNumber.fromNumber(2));
        expect(result.isNaN()).toBe(true);
    });
});

describe('gamma', () => {
    it('should calculate gamma for small numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const result = a.gamma();

        expect(result).toBeCloseToMegota(MegotaNumber.fromString("24"));
    });

    it('should calculate gamma for large numbers', () => {
        const a = MegotaNumber.fromString("1000");
        const result = a.gamma();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("4.023872600773956e2564"));
    });

    it('should handle gamma of one', () => {
        const a = MegotaNumber.fromNumber(1);
        const result = a.gamma();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle gamma of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.gamma();
        expect(result.isNaN()).toBe(true); // Gamma function is undefined at zero
    });

    it('should handle gamma of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-5);
        const result = a.gamma();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-Infinity));
    });

    it('should handle NaN in gamma', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.gamma();
        expect(result.isNaN()).toBe(true);
    }); 
});

describe('factorial', () => {
    it('should calculate factorial for small integers', () => {
        const a = MegotaNumber.fromNumber(5);
        const result = a.factorial();

        expect(result).toEqualMegota(MegotaNumber.fromNumber(120));
    });

    it('should calculate factorial for large integers', () => {
        const a = MegotaNumber.fromString("20");
        const result = a.factorial();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("2432902008176640000"));
    });

    it('should handle factorial of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.factorial();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle factorial of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-5);
        const result = a.factorial();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(Infinity));
    });

    it('should handle NaN in factorial', () => {
        const a = MegotaNumber.fromNumber(NaN);
        const result = a.factorial();
        expect(result.isNaN()).toBe(true);
    });
});

describe('abs, negate, and comparison methods', () => {
    it('should return absolute value correctly', () => {
        const positive = MegotaNumber.fromNumber(5);
        const negative = MegotaNumber.fromNumber(-5);
        
        expect(positive.abs()).toEqualMegota(positive);
        expect(negative.abs()).toEqualMegota(positive);
    });

    it('should negate values correctly', () => {
        const positive = MegotaNumber.fromNumber(5);
        const negative = MegotaNumber.fromNumber(-5);
        
        expect(positive.negate()).toEqualMegota(negative);
        expect(negative.negate()).toEqualMegota(positive);
    });

    it('should check if number is integer correctly', () => {
        const integer = MegotaNumber.fromNumber(5);
        const nonInteger = MegotaNumber.fromNumber(5.5);
        
        expect(integer.isInteger()).toBe(true);
        expect(nonInteger.isInteger()).toBe(false);
    });

    it('should check infinity correctly', () => {
        const posInf = MegotaNumber.fromNumber(Infinity);
        const negInf = MegotaNumber.fromNumber(-Infinity);
        const normal = MegotaNumber.fromNumber(5);
        
        expect(posInf.isPositiveInfinity()).toBe(true);
        expect(negInf.isPositiveInfinity()).toBe(false);
        
        expect(posInf.isNegativeInfinity()).toBe(false);
        expect(negInf.isNegativeInfinity()).toBe(true);
        
        expect(posInf.isInfinite()).toBe(true);
        expect(negInf.isInfinite()).toBe(true);
        expect(normal.isInfinite()).toBe(false);
    });

    it('should handle NaN in compareTo', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        const normal = MegotaNumber.fromNumber(5);
        
        expect(isNaN(nan.compareTo(normal))).toBe(true);
        expect(isNaN(normal.compareTo(nan))).toBe(true);
    });

    it('should compare values with tolerance', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(5.0000001);
        const c = MegotaNumber.fromNumber(6);
        
        // With tolerance, these should be considered equal
        expect(a.equals_tolerance(b, 0.001)).toBe(true);
        expect(a.equals_tolerance(c, 0.001)).toBe(false);
        
        expect(a.compareTo_tolerance(b, 0.001)).toBe(0);
        expect(a.compareTo_tolerance(c, 0.001)).toBe(-1);
        
        expect(a.greaterThan_tolerance(b, 0.001)).toBe(false);
        expect(c.greaterThan_tolerance(a, 0.001)).toBe(true);
        
        expect(a.lessThan_tolerance(b, 0.001)).toBe(false);
        expect(a.lessThan_tolerance(c, 0.001)).toBe(true);
        
        expect(a.greaterThanOrEquals_tolerance(b, 0.001)).toBe(true);
        expect(a.greaterThanOrEquals_tolerance(c, 0.001)).toBe(false);
        
        expect(a.lessThanOrEquals_tolerance(b, 0.001)).toBe(true);
        expect(c.lessThanOrEquals_tolerance(a, 0.001)).toBe(false);
    });

    it('should handle min and max correctly', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        
        expect(a.min(b)).toEqualMegota(a);
        expect(b.min(a)).toEqualMegota(a);
        
        expect(a.max(b)).toEqualMegota(b);
        expect(b.max(a)).toEqualMegota(b);
    });

    it('should handle lessThan correctly', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        
        expect(a.lessThan(b)).toBe(true);
        expect(b.lessThan(a)).toBe(false);
    });

    it('should handle lessThanOrEquals correctly', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(5);
        const c = MegotaNumber.fromNumber(10);
        
        expect(a.lessThanOrEquals(b)).toBe(true);
        expect(a.lessThanOrEquals(c)).toBe(true);
        expect(c.lessThanOrEquals(a)).toBe(false);
    });
});

describe('modulo operation', () => {
    it('should calculate modulo correctly', () => {
        const a = MegotaNumber.fromNumber(10);
        const b = MegotaNumber.fromNumber(3);
        
        expect(a.modulo(b)).toEqualMegota(MegotaNumber.fromNumber(1));
    });
    
    it('should handle modulo by zero', () => {
        const a = MegotaNumber.fromNumber(10);
        const zero = MegotaNumber.fromNumber(0);
        
        expect(a.modulo(zero)).toEqual(MegotaNumber.fromNumber(0)); // parity with other libraries
    });
    
    it('should handle modulo with NaN', () => {
        const a = MegotaNumber.fromNumber(10);
        const nan = MegotaNumber.fromNumber(NaN);
        
        expect(a.modulo(nan).isNaN()).toBe(true);
        expect(nan.modulo(a))
    });
});

describe('reciprocal method', () => {
    it('should calculate reciprocal correctly', () => {
        const a = MegotaNumber.fromNumber(4);
        
        expect(a.reciprocal()).toEqualMegota(MegotaNumber.fromNumber(0.25));
    });
    
    it('should handle reciprocal of zero', () => {
        const zero = MegotaNumber.fromNumber(0);
        
        expect(zero.reciprocal().isNaN()).toBe(true);
    });
    
    it('should handle reciprocal of NaN', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        
        expect(nan.reciprocal().isNaN()).toBe(true);
    });
});

describe('fromBigInt method', () => {
    it('should create MegotaNumber from positive BigInt', () => {
        const bigInt = BigInt('123456789012345678901234567890');
        const num = MegotaNumber.fromBigInt(bigInt);
        
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBeGreaterThan(29);  // Approximate log10 of the number
    });
    
    it('should create MegotaNumber from negative BigInt', () => {
        const bigInt = BigInt('-123456789012345678901234567890');
        const num = MegotaNumber.fromBigInt(bigInt);
        
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBeGreaterThan(29);
    });
    
    it('should handle BigInt zero', () => {
        const bigInt = BigInt('0');
        const num = MegotaNumber.fromBigInt(bigInt);
        
        expect(num).toEqualMegota(MegotaNumber.fromNumber(0));
    });
});

describe('advanced operations', () => {
    it('should calculate tetration correctly', () => {
        const base = MegotaNumber.fromNumber(2);
        const height = MegotaNumber.fromNumber(3);
        
        // 2 ^^ 3 = 2^(2^2) = 2^4 = 16
        expect(base.tetrate(height)).toEqualMegota(MegotaNumber.fromNumber(16));
    });
    
    it('should handle special tetration cases', () => {
        const base = MegotaNumber.fromNumber(2);
        const zero = MegotaNumber.fromNumber(0);
        const one = MegotaNumber.fromNumber(1);
        
        // Any number ^^ 0 = 1
        expect(base.tetrate(zero)).toEqualMegota(MegotaNumber.fromNumber(1));
        
        // Any number ^^ 1 = that number
        expect(base.tetrate(one)).toEqualMegota(base);
    });
    
    it('should handle tetration with payload', () => {
        const base = MegotaNumber.fromNumber(2);
        const height = MegotaNumber.fromNumber(3);
        const payload = MegotaNumber.fromNumber(3);
        
        // This tests the custom payload parameter
        const result = base.tetrate(height, payload);
        expect(result).not.toEqualMegota(base.tetrate(height));
    });
    
    it('should calculate super-logarithm correctly', () => {
        const num = MegotaNumber.fromNumber(16);
        const base = MegotaNumber.fromNumber(2);
        
        // slog_2(16) = 3 because 2 ^^ 3 = 16
        expect(num.slog(base)).toBeCloseToMegota(MegotaNumber.fromNumber(3));
    });
    
    it('should handle special slog cases', () => {
        const one = MegotaNumber.fromNumber(1);
        const base = MegotaNumber.fromNumber(2);
        
        // slog_b(1) = 0 for any base b > 1
        expect(one.slog(base)).toBeCloseToMegota(MegotaNumber.fromNumber(0));
    });
    
    it('should calculate tetrateAdd correctly', () => {
        const base = MegotaNumber.fromNumber(2);
        const result = base.tetrateAdd();
        
        expect(result).not.toEqualMegota(base);
    });
    
    it('should calculate ssqrt correctly', () => {
        const num = MegotaNumber.fromNumber(4);
        const result = num.ssqrt();
        
        expect(result).not.toEqualMegota(num);
    });
});

describe('operator function', () => {
    it('should get and set operator values correctly', () => {
        const num = MegotaNumber.fromNumber(5);
        
        // Get the value at [0, 0]
        expect(num.operator([0, 0])).toBe(5);
        
        // Set a new value
        num.operator([0, 0], 1);
        expect(num.operator([0, 0])).toBe(1);
        
        // Set it back to original
        num.operator([0, 0], 0);
        expect(num.operator([0, 0])).toBe(0);
    });
    
    it('should use getOperatorIndex correctly', () => {
        const num = new MegotaNumber();
        num.array = [[0, 0, 5], [1, 0, 10], [1, 1, 15]];
        
        // Test binary search functionality
        expect(num.getOperatorIndex([0, 0])).toBe(0);
        expect(num.getOperatorIndex([1, 0])).toBe(1);
        expect(num.getOperatorIndex([1, 1])).toBe(2);
        expect(num.getOperatorIndex([2, 0])).toBe(1.5); // Where it would be if it existed
    });
});

describe('arrow and hyperoperation functions', () => {
    it('should handle arrow operations correctly', () => {
        const two = MegotaNumber.fromNumber(2);
        const three = MegotaNumber.fromNumber(3);
        const arrows = MegotaNumber.fromNumber(1);
        
        // 2^3 = 8
        const arrowFn = two.arrow(arrows);
        expect(arrowFn(three)).toEqualMegota(MegotaNumber.fromNumber(8));
    });
    
    it('should handle hyperoperation correctly', () => {
        const two = MegotaNumber.fromNumber(2);
        const three = MegotaNumber.fromNumber(3);
        
        // Level 2 is multiplication: 2 * 3 = 6
        const level = MegotaNumber.fromNumber(2);
        const hyperOp = MegotaNumber.hyperoperation(level);
        expect(hyperOp(two, three)).toEqualMegota(MegotaNumber.fromNumber(6));
        
        // Instance method version
        const hyperOpInstance = two.hyperoperation(level);
        expect(hyperOpInstance(three)).toEqualMegota(MegotaNumber.fromNumber(6));
    });
    
    it('should handle expansion method', () => {
        const two = MegotaNumber.fromNumber(2);
        const three = MegotaNumber.fromNumber(3);
        
        const result = two.expansion(three);
        expect(result).not.toEqualMegota(two);
    });
});

describe('series calculation methods', () => {
    it('should calculate maxTermsInGeometricSeries', () => {
        const sum = MegotaNumber.fromNumber(31);
        const first = MegotaNumber.fromNumber(1);
        const ratio = MegotaNumber.fromNumber(2);
        const offset = MegotaNumber.fromNumber(0);
        
        // Sum of geometric series: 1 + 2 + 4 + 8 + 16 = 31
        // So there should be 5 terms
        const terms = MegotaNumber.maxTermsInGeometricSeries(sum, first, ratio, offset);
        expect(terms).toEqualMegota(MegotaNumber.fromNumber(5));
    });
    
    it('should calculate maxTermsInArithmeticSeries', () => {
        const sum = MegotaNumber.fromNumber(15);
        const first = MegotaNumber.fromNumber(1);
        const diff = MegotaNumber.fromNumber(1);
        const offset = MegotaNumber.fromNumber(0);
        
        // Sum of arithmetic series: 1 + 2 + 3 + 4 + 5 = 15
        // So there should be 5 terms
        const terms = MegotaNumber.maxTermsInArithmeticSeries(sum, first, diff, offset);
        expect(terms).toEqualMegota(MegotaNumber.fromNumber(5));
    });
    
    it('should calculate sumGeometricSeries', () => {
        const terms = MegotaNumber.fromNumber(5);
        const first = MegotaNumber.fromNumber(1);
        const ratio = MegotaNumber.fromNumber(2);
        const offset = MegotaNumber.fromNumber(0);
        
        // Sum of geometric series: 1 + 2 + 4 + 8 + 16 = 31
        const sum = MegotaNumber.sumGeometricSeries(terms, first, ratio, offset);
        expect(sum).toEqualMegota(MegotaNumber.fromNumber(31));
    });
    
    it('should calculate sumArithmeticSeries', () => {
        const terms = MegotaNumber.fromNumber(5);
        const first = MegotaNumber.fromNumber(1);
        const diff = MegotaNumber.fromNumber(1);
        const offset = MegotaNumber.fromNumber(0);
        
        // Sum of arithmetic series: 1 + 2 + 3 + 4 + 5 = 15
        const sum = MegotaNumber.sumArithmeticSeries(terms, first, diff, offset);
        expect(sum).toEqualMegota(MegotaNumber.fromNumber(15));
    });
});

describe('choose function', () => {
    it('should calculate combinations correctly', () => {
        const n = MegotaNumber.fromNumber(5);
        const k = MegotaNumber.fromNumber(2);
        
        // 5C2 = 10
        const result = n.choose(k);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(10));
    });
    
    it('should handle special choose cases', () => {
        const n = MegotaNumber.fromNumber(5);
        const zero = MegotaNumber.fromNumber(0);
        const same = MegotaNumber.fromNumber(5);
        
        // nC0 = 1
        expect(n.choose(zero)).toEqualMegota(MegotaNumber.fromNumber(1));
        
        // nCn = 1
        expect(n.choose(same)).toEqualMegota(MegotaNumber.fromNumber(1));
    });
});

describe('lambertw function', () => {
    it('should calculate lambertw correctly', () => {
        // e^x * x = 1 when x = W(1)
        const one = MegotaNumber.fromNumber(1);
        const result = one.lambertw();
        
        // W(1) is approximately 0.5671
        expect(result).toBeCloseToMegota(MegotaNumber.fromNumber(0.5671), 0.001);
        
        // Test that e^x * x = 1
        const exp = result.exp();
        const product = exp.mul(result);
        expect(product).toBeCloseToMegota(one, 0.001);
    });
    
    it('should handle special lambertw cases', () => {
        const zero = MegotaNumber.fromNumber(0);
        
        // W(0) = 0
        expect(zero.lambertw()).toEqualMegota(zero);
    });
});

describe('rounding methods', () => {
    it('should calculate floor correctly', () => {
        const num = MegotaNumber.fromNumber(5.7);
        expect(num.floor()).toEqualMegota(MegotaNumber.fromNumber(5));
        
        const negNum = MegotaNumber.fromNumber(-5.7);
        expect(negNum.floor()).toEqualMegota(MegotaNumber.fromNumber(-6));
    });
    
    it('should calculate ceil correctly', () => {
        const num = MegotaNumber.fromNumber(5.3);
        expect(num.ceil()).toEqualMegota(MegotaNumber.fromNumber(6));
        
        const negNum = MegotaNumber.fromNumber(-5.3);
        expect(negNum.ceil()).toEqualMegota(MegotaNumber.fromNumber(-5));
    });
    
    it('should calculate round correctly', () => {
        const num1 = MegotaNumber.fromNumber(5.3);
        expect(num1.round()).toEqualMegota(MegotaNumber.fromNumber(5));
        
        const num2 = MegotaNumber.fromNumber(5.7);
        expect(num2.round()).toEqualMegota(MegotaNumber.fromNumber(6));
        
        const negNum1 = MegotaNumber.fromNumber(-5.3);
        expect(negNum1.round()).toEqualMegota(MegotaNumber.fromNumber(-5));
        
        const negNum2 = MegotaNumber.fromNumber(-5.7);
        expect(negNum2.round()).toEqualMegota(MegotaNumber.fromNumber(-6));
    });
});

describe('toString method', () => {
    it('should convert normal numbers to string', () => {
        const num = MegotaNumber.fromNumber(42);
        expect(num.toString()).toBe('42');
    });
    
    it('should convert negative numbers to string', () => {
        const num = MegotaNumber.fromNumber(-42);
        expect(num.toString()).toBe('-42');
    });
    
    it('should convert large numbers to scientific notation', () => {
        const num = MegotaNumber.fromNumber(1e20);
        expect(num.toString()).toBe('1e20');
    });
    
    it('should handle special values in toString', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        expect(nan.toString()).toBe('NaN');
        
        const inf = MegotaNumber.fromNumber(Infinity);
        expect(inf.toString()).toBe('Infinity');
        
        const negInf = MegotaNumber.fromNumber(-Infinity);
        expect(negInf.toString()).toBe('-Infinity');
    });
});

describe('toNumber method', () => {
    it('should convert to JavaScript number', () => {
        const num = MegotaNumber.fromNumber(42);
        expect(num.toNumber()).toBe(42);
        
        const negNum = MegotaNumber.fromNumber(-42);
        expect(negNum.toNumber()).toBe(-42);
    });
    
    it('should handle special values in toNumber', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        expect(isNaN(nan.toNumber())).toBe(true);
        
        const inf = MegotaNumber.fromNumber(Infinity);
        expect(inf.toNumber()).toBe(Infinity);
        
        const negInf = MegotaNumber.fromNumber(-Infinity);
        expect(negInf.toNumber()).toBe(-Infinity);
    });
    
    it('should approximate very large numbers', () => {
        const large = MegotaNumber.fromString('1e500');
        expect(large.toNumber()).toBe(Infinity);
    });
});

// Test the constructor without parameters
describe('constructor', () => {
    it('should create an instance with default values', () => {
        const num = new MegotaNumber();
        expect(num.sign).toBe(1);
        expect(num.array).toEqual([[0, 0, 0]]);
        expect(num.layer).toBe(0);
    });
});

// Cover edge cases for log10LongString method
describe('log10LongString edge cases', () => {
    it('should handle scientific notation in strings', () => {
        const num = MegotaNumber.fromString('1e1000');
        expect(num.array[0][2]).toBe(1000);
    });
});

// Test the private implementation of log10PosBigInt
describe('log10PosBigInt implementation', () => {
    it('should handle large BigInt values', () => {
        const bigInt = BigInt('1' + '0'.repeat(100));
        // We can't directly call the private method, so we use fromBigInt
        const num = MegotaNumber.fromBigInt(bigInt);
        expect(num.array[0][2]).toBeCloseTo(100, 0);
    });
});
