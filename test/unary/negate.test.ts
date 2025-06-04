import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should negate values correctly', () => {
    const positive = new Megota(5);
    const negative = new Megota(-5);
    expect(positive.negate()).toEqualMegota(negative);
    expect(negative.negate()).toEqualMegota(positive);
});
