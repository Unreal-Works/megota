import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';
it('should calculate gamma for small numbers', () => {
    const a = new Megota(5);
    const result = a.gamma();
    expect(result).toBeCloseToMegota(new Megota("24"));
});
it('should calculate gamma for large numbers', () => {
    const a = new Megota("1000");
    const result = a.gamma();
    expect(result).toBeCloseToMegota(new Megota("4.023872600773956e2564"));
});
it('should handle gamma of one', () => {
    const a = new Megota(1);
    const result = a.gamma();
    expect(result).toEqualMegota(new Megota(1));
});
it('should handle gamma of zero', () => {
    const a = new Megota(0);
    const result = a.gamma();
    expect(result.isNaN()).toBe(true);
});
it('should handle gamma of negative numbers', () => {
    const a = new Megota(-5);
    const result = a.gamma();
    expect(result).toEqualMegota(new Megota(-Infinity));
});
it('should handle NaN in gamma', () => {
    const a = new Megota(NaN);
    const result = a.gamma();
    expect(result.isNaN()).toBe(true);
});
