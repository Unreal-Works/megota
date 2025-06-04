import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle reciprocal of small numbers', () => {
    const a = new Megota(0.25);
    const result = a.reciprocal();
    expect(result).toEqualMegota(new Megota(4));
});

it('should handle reciprocal of large numbers', () => {
    const a = new Megota("1e1000");
    const result = a.reciprocal();
    expect(result).toBeCloseToMegota(new Megota("1e-1000"));
});

it('should handle reciprocal of zero', () => {
    const a = new Megota(0);
    const result = a.reciprocal();
    expect(result.isNaN()).toBe(true);
});

it('should handle reciprocal of negative numbers', () => {
    const a = new Megota(-4);
    const result = a.reciprocal();
    expect(result).toEqualMegota(new Megota(-0.25));
});

it('should handle reciprocal of infinity', () => {
    const a = new Megota(Infinity);
    const result = a.reciprocal();
    expect(result).toEqualMegota(new Megota(0));
});
