import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate ceil correctly', () => {
    const num = new Megota(5.3);
    expect(num.ceil()).toEqualMegota(new Megota(6));

    const negNum = new Megota(-5.3);
    expect(negNum.ceil()).toEqualMegota(new Megota(-5));
});
