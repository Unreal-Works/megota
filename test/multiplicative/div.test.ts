import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should divide very large numbers', () => {
    const a = new Megota("1e10000");
    const b = new Megota("4e10000");
    const result = a.div(b);
    const expected = new Megota("0.25e0");
    expect(result).toBeCloseToMegota(expected);
});

it('should handle division by zero', () => {
    const a = new Megota(5);
    const b = new Megota(0);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(Infinity));
});

it('should handle division by one', () => {
    const a = new Megota(5);
    const b = new Megota(1);
    const result = a.div(b);
    expect(result).toEqualMegota(a);
});

it('should handle division by negative numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-2);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(-2.5));
});

it('should handle division by NaN', () => {
    const a = new Megota(5);
    const b = new Megota(NaN);
    const result = a.div(b);
    expect(result.isNaN()).toBe(true);
});

it('should handle zero divided by a number', () => {
    const a = new Megota(0);
    const b = new Megota(5);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle division of small by large numbers', () => {
    const a = new Megota(5);
    const b = new Megota("1e1000");
    const result = a.div(b);
    expect(result).toBeCloseToMegota(new Megota("5e-1000"));
});

it('should handle division of large by small numbers', () => {
    const a = new Megota("1e1000");
    const b = new Megota(5);
    const result = a.div(b);
    expect(result).toBeCloseToMegota(new Megota("2e999"));
});

it('should handle division of numbers with very different magnitudes', () => {
    const a = new Megota("1e-1000");
    const b = new Megota("1e1000");
    const result = a.div(b);
    expect(result).toBeCloseToMegota(new Megota("1e-2000"));
});

it('should handle division of infinities', () => {
    const a = new Megota(Infinity);
    const b = new Megota(Infinity);
    const result = a.div(b);
    expect(result.isNaN()).toBe(true);
});

it('should handle division of infinity by a finite number', () => {
    const a = new Megota(Infinity);
    const b = new Megota(5);
    const result = a.div(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle division of a finite number by infinity', () => {
    const a = new Megota(5);
    const b = new Megota(Infinity);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle division of negative infinity by a positive number', () => {
    const a = new Megota(-Infinity);
    const b = new Megota(5);
    const result = a.div(b);
    expect(result.isNegativeInfinity()).toBe(true);
});

it('should handle division of a positive number by negative infinity', () => {
    const a = new Megota(5);
    const b = new Megota(-Infinity);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(-0));
});

it('should handle division with exact results', () => {
    const a = new Megota(10);
    const b = new Megota(2);
    const result = a.div(b);
    expect(result).toEqualMegota(new Megota(5));
});

it('should handle division with repeating decimal results', () => {
    const a = new Megota(1);
    const b = new Megota(3);
    const result = a.div(b);
    expect(result).toBeCloseToMegota(new Megota(0.3333333333333333));
});

it('should handle division of zero by zero', () => {
    const a = new Megota(0);
    const b = new Megota(0);
    const result = a.div(b);
    expect(result.isNaN()).toBe(true);
});
