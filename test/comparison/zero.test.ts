import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle comparisons with zero correctly', () => {
    const zero = new Megota(0);
    const negZero = new Megota(-0);
    const smallPos = new Megota(1e-100);
    const smallNeg = new Megota(-1e-100);

    expect(zero).toEqualMegota(negZero);
    expect(zero).toBeLessThanMegota(smallPos);
    expect(zero).toBeGreaterThanMegota(smallNeg);
    expect(smallPos).toBeGreaterThanMegota(zero);
    expect(smallNeg).toBeLessThanMegota(zero);
});
