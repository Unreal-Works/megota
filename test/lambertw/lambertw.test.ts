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
