/// <reference types="../../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../../src/MegotaNumber';

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

    it('should handle lessThan and lessThanOrEquals', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const c = MegotaNumber.fromNumber(5);

        expect(a).toBeLessThanMegota(b);
        expect(b).not.toBeLessThanMegota(a);
        expect(a).toBeLessThanOrEqualMegota(c);
        expect(b).not.toBeLessThanOrEqualMegota(a);
    });

    it('should compare extremely large numbers correctly', () => {
        const a = MegotaNumber.fromString("1e1000");
        const b = MegotaNumber.fromString("1e1001");
        const c = MegotaNumber.fromString("1e1000");

        expect(a.compareTo(b)).toEqual(-1);
        expect(b.compareTo(a)).toEqual(1);
        expect(a.compareTo(c)).toEqual(0);
        expect(a).toBeLessThanMegota(b);
        expect(b).toBeGreaterThanMegota(a);
        expect(a).toEqualMegota(c);
    });

    it('should compare numbers with different signs correctly', () => {
        const pos = MegotaNumber.fromNumber(42);
        const neg = MegotaNumber.fromNumber(-42);
        const zero = MegotaNumber.fromNumber(0);

        expect(pos).toBeGreaterThanMegota(neg);
        expect(neg).toBeLessThanMegota(pos);
        expect(pos).toBeGreaterThanMegota(zero);
        expect(neg).toBeLessThanMegota(zero);
        expect(zero).toBeGreaterThanMegota(neg);
        expect(zero).toBeLessThanMegota(pos);
    });

    it('should compare with tolerance for very close numbers', () => {
        const a = MegotaNumber.fromNumber(1);
        const b = MegotaNumber.fromNumber(1.0000000001);
        const c = MegotaNumber.fromNumber(1.1);

        expect(a.equals_tolerance(b, 1e-6)).toBe(true);
        expect(a.equals_tolerance(c, 1e-6)).toBe(false);
        expect(a.compareTo_tolerance(b, 1e-6)).toBe(0);
        expect(a.compareTo_tolerance(c, 1e-6)).toBe(-1);
        expect(a.greaterThanOrEquals_tolerance(b, 1e-6)).toBe(true);
        expect(a.lessThan_tolerance(c, 1e-6)).toBe(true);
    });

    it('should handle comparisons with zero correctly', () => {
        const zero = MegotaNumber.fromNumber(0);
        const negZero = MegotaNumber.fromNumber(-0);
        const smallPos = MegotaNumber.fromNumber(1e-100);
        const smallNeg = MegotaNumber.fromNumber(-1e-100);

        expect(zero).toEqualMegota(negZero);
        expect(zero).toBeLessThanMegota(smallPos);
        expect(zero).toBeGreaterThanMegota(smallNeg);
        expect(smallPos).toBeGreaterThanMegota(zero);
        expect(smallNeg).toBeLessThanMegota(zero);
    });

    it('should compare different notations and formats correctly', () => {
        const decimal = MegotaNumber.fromNumber(1000);
        const scientific = MegotaNumber.fromString("1e3");
        const largeExponent = MegotaNumber.fromString("10^3");

        expect(decimal).toEqualMegota(scientific);
        expect(decimal).toEqualMegota(largeExponent);
        expect(scientific).toEqualMegota(largeExponent);
    });

    it('should handle infinities in comparisons correctly', () => {
        const posInf = MegotaNumber.fromNumber(Infinity);
        const negInf = MegotaNumber.fromNumber(-Infinity);
        const largeNum = MegotaNumber.fromString("1e1000000");
        const smallNum = MegotaNumber.fromNumber(-42);

        expect(posInf).toBeGreaterThanMegota(largeNum);
        expect(negInf).toBeLessThanMegota(smallNum);
        expect(largeNum).toBeLessThanMegota(posInf);
        expect(smallNum).toBeGreaterThanMegota(negInf);
        expect(posInf).toBeGreaterThanMegota(negInf);
        expect(negInf).toBeLessThanMegota(posInf);
    });

    it('should handle NaN in comparisons correctly', () => {
        const nan = MegotaNumber.fromNumber(NaN);
        const num = MegotaNumber.fromNumber(42);
        const posInf = MegotaNumber.fromNumber(Infinity);

        expect(nan.compareTo(num)).toEqual(NaN);
        expect(nan.compareTo(posInf)).toEqual(NaN);
        expect(nan.compareTo(nan)).toEqual(NaN);
        
        expect(nan.equals(num)).toBe(false);
        expect(nan.equals(nan)).toBe(false);
        
        expect(nan.greaterThan(num)).toBe(false);
        expect(nan.lessThan(num)).toBe(false);
        expect(nan.greaterThanOrEquals(num)).toBe(false);
        expect(nan.lessThanOrEquals(num)).toBe(false);
    });

    it('should compare numbers at extremes of precision', () => {
        const a = MegotaNumber.fromString("1.000000000000001");
        const b = MegotaNumber.fromString("1.000000000000002");
        
        expect(a).toBeLessThanMegota(b);
        expect(b).toBeGreaterThanMegota(a);
        expect(a).not.toEqualMegota(b);
    });

    it('should handle min and max operations correctly', () => {
        const a = MegotaNumber.fromNumber(5);
        const b = MegotaNumber.fromNumber(10);
        const c = MegotaNumber.fromNumber(-3);
        
        expect(a.min(b)).toEqualMegota(a);
        expect(a.max(b)).toEqualMegota(b);
        expect(a.min(c)).toEqualMegota(c);
        expect(a.max(c)).toEqualMegota(a);
        expect(b.min(c)).toEqualMegota(c);
        expect(b.max(c)).toEqualMegota(b);
    });

    it('should handle min and max with NaN values', () => {
        const a = MegotaNumber.fromNumber(5);
        const nan = MegotaNumber.fromNumber(NaN);
        
        expect(a.min(nan).isNaN()).toBe(true);
        expect(a.max(nan).isNaN()).toBe(true);
        expect(nan.min(a).isNaN()).toBe(true);
        expect(nan.max(a).isNaN()).toBe(true);
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