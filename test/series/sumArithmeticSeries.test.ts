import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate sumArithmeticSeries', () => {
    const terms = new Megota(5);
    const first = new Megota(1);
    const diff = new Megota(1);
    const offset = new Megota(0);
    const sum = Megota.sumArithmeticSeries(terms, first, diff, offset);
    expect(sum).toEqualMegota(new Megota(15));
});
