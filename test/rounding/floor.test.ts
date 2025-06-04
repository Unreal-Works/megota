import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate floor correctly', () => {
    const num = new Megota(5.7);
    expect(num.floor()).toEqualMegota(new Megota(5));

    const negNum = new Megota(-5.7);
    expect(negNum.floor()).toEqualMegota(new Megota(-6));
});
