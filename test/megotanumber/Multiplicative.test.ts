/// <reference types="../../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../../src/MegotaNumber';

describe('multiplicative operations', () => {
    // Basic multiplication tests
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

    it('should handle multiplication by zero', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(0);
        const result = a.mul(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle multiplication by one', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(1);
        const result = a.mul(b);
        expect(result).toEqualMegota(a);
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

    // Additional multiplication tests for comprehensive coverage
    it('should maintain multiplication commutativity (a*b = b*a)', () => {
        const a = MegotaNumber.fromString("3.14e159");
        const b = MegotaNumber.fromString("2.71e28");
        const result1 = a.mul(b);
        const result2 = b.mul(a);
        expect(result1).toBeCloseToMegota(result2);
    });

    it('should maintain multiplication associativity ((a*b)*c = a*(b*c))', () => {
        const a = MegotaNumber.fromString("1.1e50");
        const b = MegotaNumber.fromString("2.2e40");
        const c = MegotaNumber.fromString("3.3e30");
        const result1 = a.mul(b).mul(c);
        const result2 = a.mul(b.mul(c));
        expect(result1).toBeCloseToMegota(result2);
    });

    it('should handle multiplication of zero by infinity', () => {
        const a = MegotaNumber.fromNumber(0);
        const b = MegotaNumber.fromNumber(Infinity);
        const result = a.mul(b);
        expect(result.isNaN()).toBe(true);
    });

    it('should handle multiplication of numbers with different orders of magnitude', () => {
        const a = MegotaNumber.fromString("1e-20");
        const b = MegotaNumber.fromString("1e20");
        const result = a.mul(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle multiplication of fractional numbers', () => {
        const a = MegotaNumber.fromString("0.5");
        const b = MegotaNumber.fromString("0.2");
        const result = a.mul(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("0.1"));
    });

    it('should handle repeated multiplications correctly', () => {
        let product = MegotaNumber.fromNumber(1);
        for (let i = 1; i <= 5; i++) {
            product = product.mul(MegotaNumber.fromNumber(i));
        }
        expect(product).toEqualMegota(MegotaNumber.fromNumber(120)); // 5! = 120
    });

    it('should handle multiplication with extremely small numbers', () => {
        const a = MegotaNumber.fromString("1e-1000");
        const b = MegotaNumber.fromString("1e-2000");
        const result = a.mul(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("1e-3000"));
    });

    it('should handle multiplication with extremely large numbers across different notations', () => {
        const a = MegotaNumber.fromString("10^1000");
        const b = MegotaNumber.fromString("10^2000");
        const result = a.mul(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("10^3000"));
    });

    it('should handle multiplication of infinity with a positive number', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(5);
        const result = a.mul(b);
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle multiplication of infinity with a negative number', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(-5);
        const result = a.mul(b);
        expect(result.isNegativeInfinity()).toBe(true);
    });

    it('should handle multiplication of negative infinity with a positive number', () => {
        const a = MegotaNumber.fromNumber(-Infinity);
        const b = MegotaNumber.fromNumber(5);
        const result = a.mul(b);
        expect(result.isNegativeInfinity()).toBe(true);
    });

    it('should handle multiplication of negative infinity with a negative number', () => {
        const a = MegotaNumber.fromNumber(-Infinity);
        const b = MegotaNumber.fromNumber(-5);
        const result = a.mul(b);
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle multiplication of two infinities', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(Infinity);
        const result = a.mul(b);
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle multiplication of two negative infinities', () => {
        const a = MegotaNumber.fromNumber(-Infinity);
        const b = MegotaNumber.fromNumber(-Infinity);
        const result = a.mul(b);
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle multiplication of positive and negative infinity', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(-Infinity);
        const result = a.mul(b);
        expect(result.isNegativeInfinity()).toBe(true);
    });

    it('should handle multiplication at the MIN_SAFE_INTEGER boundary', () => {
        const a = MegotaNumber.fromNumber(-Number.MAX_SAFE_INTEGER);
        const b = MegotaNumber.fromNumber(1.1);
        const result = a.mul(b);
        expect(result.lessThan(MegotaNumber.fromNumber(-Number.MAX_SAFE_INTEGER))).toBe(true);
    });

    it('should handle multiplications that result in subnormal numbers', () => {
        const a = MegotaNumber.fromString("1e-30");
        const b = MegotaNumber.fromString("1e-3");
        const result = a.mul(b);
        expect(result).toBeLessThanMegota(MegotaNumber.fromString("1e-32"));
    });

    // Basic division tests
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

    it('should handle division by one', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(1);
        const result = a.div(b);
        expect(result).toEqualMegota(a);
    });

    it('should handle division by negative numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-2);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-2.5));
    });

    it('should handle division by NaN', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(NaN);
        const result = a.div(b);
        expect(result.isNaN()).toBe(true);
    });

    // Additional division tests for comprehensive coverage
    it('should handle zero divided by a number', () => {
        const a = MegotaNumber.fromNumber(0);
        const b = MegotaNumber.fromNumber(5);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle division of small by large numbers', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromString("1e1000");
        const result = a.div(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("5e-1000"));
    });

    it('should handle division of large by small numbers', () => {
        const a = MegotaNumber.fromString("1e1000");
        const b = MegotaNumber.fromNumber(5);
        const result = a.div(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("2e999"));
    });

    it('should handle division of numbers with very different magnitudes', () => {
        const a = MegotaNumber.fromString("1e-1000");
        const b = MegotaNumber.fromString("1e1000");
        const result = a.div(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("1e-2000"));
    });

    it('should handle division of infinities', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(Infinity);
        const result = a.div(b);
        expect(result.isNaN()).toBe(true);
    });

    it('should handle division of infinity by a finite number', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const b = MegotaNumber.fromNumber(5);
        const result = a.div(b);
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle division of a finite number by infinity', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(Infinity);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle division of negative infinity by a positive number', () => {
        const a = MegotaNumber.fromNumber(-Infinity);
        const b = MegotaNumber.fromNumber(5);
        const result = a.div(b);
        expect(result.isNegativeInfinity()).toBe(true);
    });

    it('should handle division of a positive number by negative infinity', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(-Infinity);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-0));
    });

    it('should handle division with exact results', () => {
        const a = MegotaNumber.fromNumber(10);
        const b = MegotaNumber.fromNumber(2);
        const result = a.div(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(5));
    });

    it('should handle division with repeating decimal results', () => {
        const a = MegotaNumber.fromNumber(1);
        const b = MegotaNumber.fromNumber(3);
        const result = a.div(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromNumber(0.3333333333333333));
    });

    it('should handle division of zero by zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const b = MegotaNumber.fromNumber(0);
        const result = a.div(b);
        expect(result.isNaN()).toBe(true);
    });

    it('should handle reciprocal of small numbers', () => {
        const a = MegotaNumber.fromNumber(0.25);
        const result = a.reciprocal();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(4));
    });

    it('should handle reciprocal of large numbers', () => {
        const a = MegotaNumber.fromString("1e1000");
        const result = a.reciprocal();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("1e-1000"));
    });

    it('should handle reciprocal of zero', () => {
        const a = MegotaNumber.fromNumber(0);
        const result = a.reciprocal();
        expect(result.isNaN()).toBe(true);
    });

    it('should handle reciprocal of negative numbers', () => {
        const a = MegotaNumber.fromNumber(-4);
        const result = a.reciprocal();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-0.25));
    });

    it('should handle reciprocal of infinity', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const result = a.reciprocal();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
    });

    it('should handle modulo operation with small numbers', () => {
        const a = MegotaNumber.fromNumber(7);
        const b = MegotaNumber.fromNumber(3);
        const result = a.modulo(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(1));
    });

    it('should handle modulo operation with large numbers', () => {
        const a = MegotaNumber.fromString("1e1000");
        const b = MegotaNumber.fromString("7e999");
        const result = a.modulo(b);
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("3e999"));
    });

    it('should handle modulo operation with zero divisor', () => {
        const a = MegotaNumber.fromNumber(7);
        const b = MegotaNumber.fromNumber(0);
        const result = a.modulo(b);
        expect(result.isNaN()).toBe(true);
    });

    it('should handle modulo operation with negative numbers', () => {
        const a = MegotaNumber.fromNumber(-7);
        const b = MegotaNumber.fromNumber(3);
        const result = a.modulo(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(-1)); // Parity with JavaScript's behavior
    });

    it('should handle modulo operation with infinities', () => {
        const a = MegotaNumber.fromNumber(7);
        const b = MegotaNumber.fromNumber(Infinity);
        const result = a.modulo(b);
        expect(result).toEqualMegota(MegotaNumber.fromNumber(7));
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