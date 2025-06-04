import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should subtract very large numbers', () => {
    const a = new Megota("1e10000");
    const b = new Megota("4e10000");
    const result = a.sub(b);
    const expected = new Megota("-3e10000");
    expect(result).toBeCloseToMegota(expected);
});

it('should correctly subtract a larger number from a smaller one', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const result = a.sub(b);
    expect(result.array[0][2]).toBe(5);
    expect(result.sign).toBe(-1);
});
