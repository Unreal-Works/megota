import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate log for small numbers', () => {
    const a = new Megota(10);
    const result = a.log();
    expect(result).toBeCloseToMegota(new Megota("2.302585092994046"));
});

it('should calculate log for large numbers', () => {
    const a = new Megota("1000");
    const result = a.log();
    expect(result).toBeCloseToMegota(new Megota("6.907755278982137"));
});

it('should calculate log with custom base', () => {
    const a = new Megota(16);
    const base = new Megota(2);
    const result = a.log(base);
    expect(result).toBeCloseToMegota(new Megota(4));
});

it('should calculate log for extremely large numbers', () => {
    const a = new Megota("1e1000");
    const result = a.log();
    expect(result).toBeCloseToMegota(new Megota("2302.585092994046"));
});

it('should handle log of one', () => {
    const a = new Megota(1);
    const result = a.log();
    expect(result).toEqualMegota(new Megota(0));
});

it('should handle log of zero', () => {
    const a = new Megota(0);
    const result = a.log();
    expect(result).toEqualMegota(new Megota(-Infinity));
});

it('should handle log of negative numbers', () => {
    const a = new Megota(-10);
    const result = a.log();
    expect(result.isNaN()).toBe(true);
});

it('should handle NaN in log', () => {
    const a = new Megota(NaN);
    const result = a.log();
    expect(result.isNaN()).toBe(true);
});
