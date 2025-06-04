import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should exponentiate small numbers', () => {
    const a = new Megota(2);
    const b = new Megota(3);
    const result = a.pow(b);
    expect(result).toEqualMegota(new Megota(8));
});

it('should exponentiate large numbers', () => {
    const a = new Megota("2e1000");
    const b = new Megota("50");
    const result = a.pow(b);
    const expected = new Megota("1.125899906842624e50015");
    expect(result).toBeCloseToMegota(expected);
});

it('should handle exponentiation with zero base', () => {
    const a = new Megota(0);
    const b = new Megota(5);
    const result = a.pow(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle zero exponent', () => {
    const a = new Megota(5);
    const result = a.pow(new Megota(0));
    expect(result).toEqualMegota(new Megota(1));
});

it('should handle one exponent', () => {
    const a = new Megota(5);
    const result = a.pow(new Megota(1));
    expect(result).toEqualMegota(a);
});

it('should handle negative exponents', () => {
    const a = new Megota(2);
    const b = new Megota(-3);
    const result = a.pow(b);
    expect(result).toEqualMegota(new Megota("0.125"));
});

it('should handle NaN base with exponentiation', () => {
    const a = new Megota(NaN);
    const b = new Megota(2);
    const result = a.pow(b);
    expect(result.isNaN()).toBe(true);
});

it('should handle NaN exponent with exponentiation', () => {
    const a = new Megota(2);
    const b = new Megota(NaN);
    const result = a.pow(b);
    expect(result.isNaN()).toBe(true);
});
