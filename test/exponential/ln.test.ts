import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate natural log for small numbers', () => {
    const a = new Megota(Math.E);
    const result = a.ln();
    expect(result).toEqualMegota(new Megota(1));
});

it('should calculate natural log for large numbers', () => {
    const a = new Megota("1000");
    const result = a.ln();
    expect(result).toBeCloseToMegota(new Megota("6.907755278982137"));
});

it('should handle ln of one', () => {
    const a = new Megota(1);
    const result = a.ln();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle ln of zero', () => {
    const a = new Megota(0);
    const result = a.ln();
    expect(result).toEqualMegota(new Megota(-Infinity));
});

it('should handle ln of negative numbers', () => {
    const a = new Megota(-10);
    const result = a.ln();
    expect(result.isNaN()).toBe(true);
});

it('should handle NaN in ln', () => {
    const a = new Megota(NaN);
    const result = a.ln();
    expect(result.isNaN()).toBe(true);
});
