/// <reference types="../../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../../src/MegotaNumber';

describe('power', () => {
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

    it('should handle exp of very negative numbers', () => {
        const a = MegotaNumber.fromNumber(-100);
        const result = a.exp();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("3.72e-44"));
    });

    it('should handle exp of very large positive numbers', () => {
        const a = MegotaNumber.fromString("10000");
        const result = a.exp();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("8.81e4342"));
    });

    it('should handle exp of very large negative numbers', () => {
        const a = MegotaNumber.fromString("-10000");
        const result = a.exp();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("0"));
    });

    it('should handle exp of infinity', () => {
        const a = MegotaNumber.fromNumber(Infinity);
        const result = a.exp();
        expect(result.isPositiveInfinity()).toBe(true);
    });

    it('should handle exp of negative infinity', () => {
        const a = MegotaNumber.fromNumber(-Infinity);
        const result = a.exp();
        expect(result).toEqualMegota(MegotaNumber.fromNumber(0));
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

    it('should calculate log with custom base', () => {
        const a = MegotaNumber.fromNumber(16);
        const base = MegotaNumber.fromNumber(2);
        const result = a.log(base);
        expect(result).toBeCloseToMegota(MegotaNumber.fromNumber(4));
    });

    it('should calculate log for extremely large numbers', () => {
        const a = MegotaNumber.fromString("1e1000");
        const result = a.log();
        expect(result).toBeCloseToMegota(MegotaNumber.fromString("2302.585092994046"));
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