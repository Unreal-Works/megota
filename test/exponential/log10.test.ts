import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate log10 for small numbers', () => {
    const a = new Megota(100);
    const result = a.log10();
    expect(result).toEqualMegota(new Megota(2));
});

it('should calculate log10 for large numbers', () => {
    const a = new Megota("1000");
    const result = a.log10();
    expect(result).toBeCloseToMegota(new Megota("3"));
});

it('should handle log10 of one', () => {
    const a = new Megota(1);
    const result = a.log10();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle log10 of zero', () => {
    const a = new Megota(0);
    const result = a.log10();
    expect(result).toEqualMegota(new Megota(-Infinity));
});

it('should handle log10 of negative numbers', () => {
    const a = new Megota(-100);
    const result = a.log10();
    expect(result.isNaN()).toBe(true);
});

it('should handle NaN in log10', () => {
    const a = new Megota(NaN);
    const result = a.log10();
    expect(result.isNaN()).toBe(true);
});
