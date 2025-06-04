import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate lambertw correctly', () => {
    const one = new Megota(1);
    const result = one.lambertw();
    expect(result).toBeCloseToMegota(new Megota(0.5671), 0.001);
    const exp = result.exp();
    const product = exp.mul(result);
    expect(product).toBeCloseToMegota(one, 0.001);
});

it('should handle special lambertw cases', () => {
    const zero = new Megota(0);
    expect(zero.lambertw()).toEqualMegota(zero);
});

it('should handle non-principal branch', () => {
    const x = new Megota(-0.1);
    // Test with non-principal branch
    const result = x.lambertw(false);
    expect(result).toBeDefined();
    // W_-1(-0.1) ≈ -3.577...
    expect(result.toNumber()).toBeLessThan(-2);
});

it('should handle edge cases', () => {
    // Test infinity
    const infinity = new Megota(Infinity);
    expect(infinity.lambertw()).toEqualMegota(infinity);

    // Test NaN
    const nan = new Megota(NaN);
    expect(nan.lambertw().isNaN()).toBe(true);

    // Test zero with non-principal branch
    const zero = new Megota(0);
    expect(zero.lambertw(false).isNegativeInfinity()).toBe(true);

    // Test e (special value where W(e) = 1)
    const e = new Megota(Math.E);
    expect(e.lambertw()).toBeCloseToMegota(new Megota(1), 0.0001);
});

it('should handle very large inputs', () => {
    // For large x, W(x) ≈ ln(x) - ln(ln(x))
    const largeValue = new Megota(1000000000);
    const result = largeValue.lambertw();
    const lnx = largeValue.ln();
    const lnlnx = lnx.ln();
    const approx = lnx.sub(lnlnx);
    expect(result).toBeCloseToMegota(approx, 0.01);
});

it('should satisfy the defining equation W(x)*e^W(x) = x', () => {
    // Test various positive values
    for (const x of [0.5, 1, 2, 5, 10]) {
        const value = new Megota(x);
        const w = value.lambertw();
        const left = w.exp().mul(w);
        expect(left).toBeCloseToMegota(value, 0.0001);
    }
});