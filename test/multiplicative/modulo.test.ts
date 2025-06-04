import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle modulo operation with small numbers', () => {
    const a = new Megota(7);
    const b = new Megota(3);
    const result = a.modulo(b);
    expect(result).toEqualMegota(new Megota(1));
});

it('should handle modulo operation with large numbers', () => {
    const a = new Megota("1e1000");
    const b = new Megota("7e999");
    const result = a.modulo(b);
    expect(result).toBeCloseToMegota(new Megota("3e999"));
});

it('should handle modulo operation with zero divisor', () => {
    const a = new Megota(7);
    const b = new Megota(0);
    const result = a.modulo(b);
    expect(result.isNaN()).toBe(true);
});

it('should handle modulo operation with negative numbers', () => {
    const a = new Megota(-7);
    const b = new Megota(3);
    const result = a.modulo(b);
    expect(result).toEqualMegota(new Megota(-1)); // Parity with JavaScript's behavior
});

it('should handle modulo operation with infinities', () => {
    const a = new Megota(7);
    const b = new Megota(Infinity);
    const result = a.modulo(b);
    expect(result).toEqualMegota(new Megota(7));
});
