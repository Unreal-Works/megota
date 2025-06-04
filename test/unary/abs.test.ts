import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should return absolute value correctly', () => {
    const positive = new Megota(5);
    const negative = new Megota(-5);
    expect(positive.abs()).toEqualMegota(positive);
    expect(negative.abs()).toEqualMegota(positive);
});
