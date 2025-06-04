import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate exp for small numbers', () => {
    const a = new Megota(1);
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("2.718281828459045"));
});

it('should calculate exp for large numbers', () => {
    const a = new Megota("1000");
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("1.97e434"));
});

it('should handle exp of zero', () => {
    const a = new Megota(0);
    const result = a.exp();
    expect(result).toEqualMegota(new Megota(1));
});

it('should handle exp of negative numbers', () => {
    const a = new Megota(-1);
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("0.36787944117144233"));
});

it('should handle exp of very negative numbers', () => {
    const a = new Megota(-100);
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("3.7200759760e-44"));
});

it('should handle exp of very large positive numbers', () => {
    const a = new Megota("10000");
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("8.81e4342"));
});

it('should handle exp of very large negative numbers', () => {
    const a = new Megota("-10000");
    const result = a.exp();
    expect(result).toBeCloseToMegota(new Megota("0"));
});

it('should handle exp of infinity', () => {
    const a = new Megota(Infinity);
    const result = a.exp();
    expect(result.isPositiveInfinity()).toBe(true);
});

it('should handle exp of negative infinity', () => {
    const a = new Megota(-Infinity);
    const result = a.exp();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle NaN in exp', () => {
    const a = new Megota(NaN);
    const result = a.exp();
    expect(result.isNaN()).toBe(true);
});
