import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should multiply small positive numbers', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const result = a.mul(b);
    expect(result).toEqualMegota(new Megota(50));
});

it('should multiply small negative numbers', () => {
    const a = new Megota(-5);
    const b = new Megota(-10);
    const result = a.mul(b);
    expect(result).toEqualMegota(new Megota(50));
});

it('should multiply positive and negative numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-3);
    const result = a.mul(b);
    expect(result).toEqualMegota(new Megota(-15));
});

it('should multiply large positive numbers', () => {
    const a = new Megota("1.5e1000");
    const b = new Megota("2.2e1000");
    const result = a.mul(b);
    const expected = new Megota("3.3e2000");
    expect(result).toBeCloseToMegota(expected);
});

it('should multiply large negative numbers', () => {
    const a = new Megota("-5.5e1000");
    const b = new Megota("-2.2e1000");
    const result = a.mul(b);
    const expected = new Megota("12.1e2000");
    expect(result).toBeCloseToMegota(expected);
});

it('should multiply very large numbers', () => {
    const a = new Megota("1e10000");
    const b = new Megota("4e10000");
    const result = a.mul(b);
    const expected = new Megota("4e20000");
    expect(result).toBeCloseToMegota(expected);
});

it('should multiply very large negative numbers', () => {
    const a = new Megota("-2e10000");
    const b = new Megota("-3e10000");
    const result = a.mul(b);
    const expected = new Megota("6e20000");
    expect(result).toBeCloseToMegota(expected);
});

it('should multiply small numbers with large numbers', () => {
    const a = new Megota(5);
    const b = new Megota("1e1000");
    const result = a.mul(b);
    const expected = new Megota("5e1000");
    expect(result).toBeCloseToMegota(expected);
});

it('should handle multiplication by zero', () => {
    const a = new Megota(5);
    const b = new Megota(0);
    const result = a.mul(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle multiplication by one', () => {
    const a = new Megota(5);
    const b = new Megota(1);
    const result = a.mul(b);
    expect(result).toEqualMegota(a);
});

it('should handle multiplication by negative numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-2);
    const result = a.mul(b);
    expect(result).toEqualMegota(new Megota(-10));
});

it('should handle multiplication with NaN', () => {
    const a = new Megota(5);
    const b = new Megota(NaN);
    const result = a.mul(b);
    expect(result.isNaN()).toBe(true);
});

it('should maintain multiplication commutativity (a*b = b*a)', () => {
    const a = new Megota("3.14e159");
    const b = new Megota("2.71e28");
    const result1 = a.mul(b);
    const result2 = b.mul(a);
    expect(result1).toBeCloseToMegota(result2);
});

it('should maintain multiplication associativity ((a*b)*c = a*(b*c))', () => {
    const a = new Megota("1.1e50");
    const b = new Megota("2.2e40");
    const c = new Megota("3.3e30");
    const result1 = a.mul(b).mul(c);
    const result2 = a.mul(b.mul(c));
    expect(result1).toBeCloseToMegota(result2);
});

it('should handle multiplication of zero by infinity', () => {
    const a = new Megota(0);
    const b = new Megota(Infinity);
    const result = a.mul(b);
    expect(result.isNaN()).toBe(true);
});

it('should handle multiplication of numbers with different orders of magnitude', () => {
    const a = new Megota("1e-20");
    const b = new Megota("1e20");
    const result = a.mul(b);
    expect(result).toBeCloseToMegota(new Megota(1));
});

it('should handle multiplication of fractional numbers', () => {
    const a = new Megota("0.5");
    const b = new Megota("0.2");
    const result = a.mul(b);
    expect(result).toBeCloseToMegota(new Megota("0.1"));
});

it('should handle repeated multiplications correctly', () => {
    let product = new Megota(1);
    for (let i = 1; i <= 5; i++) {
        product = product.mul(new Megota(i));
    }
    expect(product).toEqualMegota(new Megota(120)); // 5! = 120
});

it('should handle multiplication with extremely small numbers', () => {
    const a = new Megota("1e-1000");
    const b = new Megota("1e-2000");
    const result = a.mul(b);
    expect(result).toBeCloseToMegota(new Megota("1e-3000"));
});

it('should handle multiplication with extremely large numbers across different notations', () => {
    const a = new Megota("10^1000");
    const b = new Megota("10^2000");
    const result = a.mul(b);
    expect(result).toBeCloseToMegota(new Megota("10^3000"));
});

it('should handle multiplication of infinity with a positive number', () => {
    const a = new Megota(Infinity);
    const b = new Megota(5);
    const result = a.mul(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle multiplication of infinity with a negative number', () => {
    const a = new Megota(Infinity);
    const b = new Megota(-5);
    const result = a.mul(b);
    expect(result.isNegativeInfinity()).toBe(true);
});

it('should handle multiplication of negative infinity with a positive number', () => {
    const a = new Megota(-Infinity);
    const b = new Megota(5);
    const result = a.mul(b);
    expect(result.isNegativeInfinity()).toBe(true);
});

it('should handle multiplication of negative infinity with a negative number', () => {
    const a = new Megota(-Infinity);
    const b = new Megota(-5);
    const result = a.mul(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle multiplication of two infinities', () => {
    const a = new Megota(Infinity);
    const b = new Megota(Infinity);
    const result = a.mul(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle multiplication of two negative infinities', () => {
    const a = new Megota(-Infinity);
    const b = new Megota(-Infinity);
    const result = a.mul(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle multiplication of positive and negative infinity', () => {
    const a = new Megota(Infinity);
    const b = new Megota(-Infinity);
    const result = a.mul(b);
    expect(result.isNegativeInfinity()).toBe(true);
});

it('should handle multiplication at the MIN_SAFE_INTEGER boundary', () => {
    const a = new Megota(-Number.MAX_SAFE_INTEGER);
    const b = new Megota(1.1);
    const result = a.mul(b);
    expect(result.lessThan(new Megota(-Number.MAX_SAFE_INTEGER))).toBe(true);
});

it('should handle multiplications that result in subnormal numbers', () => {
    const a = new Megota("1e-30");
    const b = new Megota("1e-3");
    const result = a.mul(b);
    expect(result).toBeLessThanMegota(new Megota("1e-32"));
});
