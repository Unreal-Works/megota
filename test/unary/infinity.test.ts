import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should check infinity correctly', () => {
    const posInf = new Megota(Infinity);
    const negInf = new Megota(-Infinity);
    const normal = new Megota(5);
    expect(posInf.isPositiveInfinity()).toBe(true);
    expect(negInf.isPositiveInfinity()).toBe(false);
    expect(posInf.isNegativeInfinity()).toBe(false);
    expect(negInf.isNegativeInfinity()).toBe(true);
    expect(posInf.isInfinite()).toBe(true);
    expect(negInf.isInfinite()).toBe(true);
    expect(normal.isInfinite()).toBe(false);
});
