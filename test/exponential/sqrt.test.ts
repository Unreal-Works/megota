import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate square root for small numbers', () => {
    const a = new Megota(4);
    const result = a.sqrt();
    expect(result).toEqualMegota(new Megota(2));
});

it('should calculate square root for large numbers', () => {
    const a = new Megota("1000");
    const result = a.sqrt();
    expect(result).toBeCloseToMegota(new Megota("31.622776601683793"));
});

it('should handle square root of zero', () => {
    const a = new Megota(0);
    const result = a.sqrt();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle square root of negative numbers', () => {
    const a = new Megota(-4);
    const result = a.sqrt();
    expect(result.isNaN()).toBe(true);
});

it('should handle NaN in sqrt', () => {
    const a = new Megota(NaN);
    const result = a.sqrt();
    expect(result.isNaN()).toBe(true);
});
