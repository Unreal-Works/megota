import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate maxTermsInGeometricSeries', () => {
    const sum = new Megota(31);
    const first = new Megota(1);
    const ratio = new Megota(2);
    const offset = new Megota(0);
    const terms = Megota.maxTermsInGeometricSeries(sum, first, ratio, offset);
    expect(terms).toEqualMegota(new Megota(5));
});
