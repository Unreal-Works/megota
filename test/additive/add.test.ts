import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should add small positive numbers', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const result = a.add(b);

    expect(result.array[0][2]).toBe(15);
    expect(result.sign).toBe(1);
});

it('should add small negative numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-10);
    const result = a.add(b);

    expect(result).toEqualMegota(new Megota(-5));
});

it('should add positive and negative numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-3);
    const result = a.add(b);

    expect(result).toEqualMegota(new Megota(2));
});

it('should add large positive numbers', () => {
    const a = new Megota("1.5e1000");
    const b = new Megota("2.2e1000");
    const result = a.add(b);
    const expected = new Megota("3.7e1000");
    expect(result).toBeCloseToMegota(expected);
});

it('should add large negative numbers', () => {
    const a = new Megota("-5.5e1000");
    const b = new Megota("-2.2e1000");
    const result = a.add(b);
    const expected = new Megota("-7.7e1000");
    expect(result).toBeCloseToMegota(expected);
});

it('should add very large numbers', () => {
    const a = new Megota("1e10000");
    const b = new Megota("4e10000");
    const result = a.add(b);
    const expected = new Megota("5e10000");
    expect(result).toBeCloseToMegota(expected);
});

it('should add positive and negative large numbers', () => {
    const a = new Megota("1.5e1000");
    const b = new Megota("-2.2e1000");
    const result = a.add(b);
    const expected = new Megota("-0.7e1000");
    expect(result).toBeCloseToMegota(expected);
});


it('should handle addition with self', () => {
    const a = new Megota(7);
    const result = a.add(a);
    expect(result.array[0][2]).toBe(14);
});

it('should handle chained additions correctly', () => {
    const a = new Megota(3);
    const b = new Megota(4);
    const c = new Megota(5);
    const result = a.add(b).add(c);
    expect(result.array[0][2]).toBe(12);
});

it('should handle addition with negative zero', () => {
    const a = new Megota(5);
    const b = new Megota(-0);
    const result = a.add(b);
    expect(result.array[0][2]).toBe(5);
    expect(result.sign).toBe(1);
});

it('should add numbers with different magnitudes', () => {
    const a = new Megota("1e500");
    const b = new Megota(1);
    const result = a.add(b);
    expect(result).toBeCloseToMegota(new Megota("1e500"));
});

it('should add numbers with vastly different magnitudes', () => {
    const a = new Megota("1e1000");
    const b = new Megota("1e-1000");
    const result = a.add(b);
    expect(result).toBeCloseToMegota(new Megota("1e1000"));
});

it('should maintain commutativity (a+b = b+a)', () => {
    const a = new Megota("3.14e159");
    const b = new Megota("2.71e28");
    const result1 = a.add(b);
    const result2 = b.add(a);
    expect(result1).toBeCloseToMegota(result2);
});

it('should maintain associativity ((a+b)+c = a+(b+c))', () => {
    const a = new Megota("1.1e200");
    const b = new Megota("2.2e200");
    const c = new Megota("3.3e200");
    const result1 = a.add(b).add(c);
    const result2 = a.add(b.add(c));
    expect(result1).toBeCloseToMegota(result2);
});

it('should add positive infinity correctly', () => {
    const a = new Megota(5);
    const b = new Megota(Number.POSITIVE_INFINITY);
    const result = a.add(b);
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should add negative infinity correctly', () => {
    const a = new Megota(5);
    const b = new Megota(Number.NEGATIVE_INFINITY);
    const result = a.add(b);
    expect(result.isNegativeInfinity()).toBe(true);
});

it('should handle infinity + (-infinity) = NaN', () => {
    const a = new Megota(Number.POSITIVE_INFINITY);
    const b = new Megota(Number.NEGATIVE_INFINITY);
    const result = a.add(b);
    expect(result.isNaN()).toBe(true);
});

it('should add numbers that cause carrying', () => {
    const a = new Megota(9);
    const b = new Megota(1);
    const result = a.add(b);
    expect(result.array[0][2]).toBe(10);
});

it('should handle decimal precision correctly', () => {
    const a = new Megota("0.1");
    const b = new Megota("0.2");
    const result = a.add(b);
    const expected = new Megota("0.3");
    expect(result).toBeCloseToMegota(expected);
});

it('should correctly add numbers with different signs and equal magnitudes', () => {
    const a = new Megota("1e100");
    const b = new Megota("-1e100");
    const result = a.add(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should correctly add numbers with different notation formats', () => {
    const a = new Megota("1.5e10");
    const b = new Megota("15000000000");
    const result = a.add(b);
    const expected = new Megota("3e10");
    expect(result).toBeCloseToMegota(expected);
});

it('should handle MAX_SAFE_INTEGER boundary cases', () => {
    const a = new Megota(Number.MAX_SAFE_INTEGER);
    const b = new Megota(1);
    const result = a.add(b);
    expect(result.greaterThan(new Megota(Number.MAX_SAFE_INTEGER))).toBe(true);
});

it('should add very small decimals correctly', () => {
    const a = new Megota("1e-100");
    const b = new Megota("2e-100");
    const result = a.add(b);
    const expected = new Megota("3e-100");
    expect(result).toBeCloseToMegota(expected);
});

it('should add two different layers correctly', () => {
    const a = new Megota("10^1000");
    const b = new Megota("10^500");
    const result = a.add(b);
    expect(result).toBeCloseToMegota(new Megota("10^1000"));
});

it('should add extremely large numbers', () => {
    const a = new Megota("J2");
    const b = new Megota("J2");
    const result = a.add(b);
    const expected = new Megota("J2");
    expect(result).toBeCloseToMegota(expected);
});

it('should handle zero sum with small numbers', () => {
    const a = new Megota(5);
    const b = new Megota(-5);
    const result = a.add(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle zero sum with very large numbers', () => {
    const a = new Megota("1e10000");
    const b = new Megota("-1e10000");
    const result = a.add(b);
    expect(result).toEqualMegota(new Megota(0));
});

it('should add zero correctly', () => {
    const a = new Megota(5);
    const b = new Megota(0);
    const result = a.add(b);

    expect(result.array[0][2]).toBe(5);
    expect(result.sign).toBe(1);
});

it('should handle addition with NaN', () => {
    const a = new Megota(5);
    const b = new Megota(NaN);
    const result = a.add(b);

    expect(result.isNaN()).toBe(true);
});

it('should handle repeated additions correctly', () => {
    let sum = new Megota(0);
    for (let i = 1; i <= 100; i++) {
        sum = sum.add(new Megota(i));
    }
    expect(sum.array[0][2]).toBe(5050); // Sum of numbers 1 to 100
});