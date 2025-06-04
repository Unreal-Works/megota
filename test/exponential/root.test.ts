import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate nth root for small numbers', () => {
    const a = new Megota(16);
    const result = a.root(new Megota(4));
    expect(result).toEqualMegota(new Megota(2));
});

it('should calculate nth root for large numbers', () => {
    const a = new Megota("1000");
    const result = a.root(new Megota(3));
    expect(result).toBeCloseToMegota(new Megota("10"));
});

it('should handle nth root of zero', () => {
    const a = new Megota(0);
    const result = a.root(new Megota(3));
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle nth root of negative numbers', () => {
    const a = new Megota(-16);
    const result = a.root(new Megota(4));
    expect(result.isNaN()).toBe(true);
});

it('should handle nth root of negative numbers with odd roots', () => {
    const a = new Megota(-27);
    const result = a.root(new Megota(3));
    expect(result).toEqualMegota(new Megota(-3));
});

it('should handle NaN in root', () => {
    const a = new Megota(NaN);
    const result = a.root(new Megota(2));
    expect(result.isNaN()).toBe(true);
});
