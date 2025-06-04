import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate round correctly', () => {
    const num1 = new Megota(5.3);
    expect(num1.round()).toEqualMegota(new Megota(5));

    const num2 = new Megota(5.7);
    expect(num2.round()).toEqualMegota(new Megota(6));

    const negNum1 = new Megota(-5.3);
    expect(negNum1.round()).toEqualMegota(new Megota(-5));

    const negNum2 = new Megota(-5.7);
    expect(negNum2.round()).toEqualMegota(new Megota(-6));
});
