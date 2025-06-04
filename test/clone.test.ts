import { expect, it } from '@jest/globals';
import Megota from '../src/index';

it('should create an identical but separate copy', () => {
    const original = new Megota(42);
    const clone = original.clone();

    expect(clone).toEqualMegota(original);

    // Modify clone and check that original is unchanged
    clone.array[0][2] = 43;
    expect(original.array[0][2]).toBe(42);
});