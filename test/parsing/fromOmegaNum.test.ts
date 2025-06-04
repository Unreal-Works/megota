import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should create from OmegaNum-style array', () => {
    const result = Megota.fromOmegaNum([5, 3]); // 10^(10^(10^5)) = ee100000
    const ten = new Megota(10);
    const expected = ten.pow(ten.pow(ten.pow(new Megota(5))));
    expect(result).toEqualMegota(expected);
});

it('should handle empty arrays', () => {
    const num = Megota.fromOmegaNum([]);
    expect(num.equals(new Megota(0))).toBe(true);
});