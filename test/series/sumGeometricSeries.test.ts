import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate sumGeometricSeries', () => {
    const terms = new Megota(5);
    const first = new Megota(1);
    const ratio = new Megota(2);
    const offset = new Megota(0);
    const sum = Megota.sumGeometricSeries(terms, first, ratio, offset);
    expect(sum).toEqualMegota(new Megota(31));
});
