import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate cube root for small numbers', () => {
    const a = new Megota(8);
    const result = a.cbrt();
    expect(result).toEqualMegota(new Megota(2));
});

it('should calculate cube root for large numbers', () => {
    const a = new Megota("1000");
    const result = a.cbrt();
    expect(result).toBeCloseToMegota(new Megota("10"));
});

it('should handle cube root of zero', () => {
    const a = new Megota(0);
    const result = a.cbrt();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle cube root of negative numbers', () => {
    const a = new Megota(-8);
    const result = a.cbrt();
    expect(result).toEqualMegota(new Megota(-2));
});

it('should handle NaN in cbrt', () => {
    const a = new Megota(NaN);
    const result = a.cbrt();
    expect(result.isNaN()).toBe(true);
});
