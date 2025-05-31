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