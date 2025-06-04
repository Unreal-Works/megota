import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should compare numbers correctly using equals', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const c = new Megota(5);
    const d = new Megota(-5);

    expect(a).toEqualMegota(c);
    expect(a).not.toEqualMegota(b);
    expect(a).not.toEqualMegota(d);
});


it('should compare different notations and formats correctly', () => {
    const decimal = new Megota(1000);
    const scientific = new Megota("1e3");
    const largeExponent = new Megota("10^3");

    expect(decimal).toEqualMegota(scientific);
    expect(decimal).toEqualMegota(largeExponent);
    expect(scientific).toEqualMegota(largeExponent);
});

it('should compare numbers at extremes of precision', () => {
    const a = new Megota("1.000000000000001");
    const b = new Megota("1.000000000000002");

    expect(a).not.toEqualMegota(b);
});
