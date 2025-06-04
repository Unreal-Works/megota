import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate maxTermsInArithmeticSeries', () => {
    const sum = new Megota(15);
    const first = new Megota(1);
    const diff = new Megota(1);
    const offset = new Megota(0);
    const terms = Megota.maxTermsInArithmeticSeries(sum, first, diff, offset);
    expect(terms).toEqualMegota(new Megota(5));
});
