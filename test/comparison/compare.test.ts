import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should compare numbers correctly using compare', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const c = new Megota(5);
    const d = new Megota(-5);

    expect(a.compare(b)).toEqual(-1);
    expect(a.compare(c)).toEqual(0);
    expect(d.compare(a)).toEqual(-1);
});

it('should compare extremely large numbers correctly', () => {
    const a = new Megota("1e1000");
    const b = new Megota("1e1001");
    const c = new Megota("1e1000");

    expect(a.compare(b)).toEqual(-1);
    expect(b.compare(a)).toEqual(1);
    expect(a.compare(c)).toEqual(0);
});

it('should handle NaN in compareTo', () => {
    const nan = new Megota(NaN);
    const normal = new Megota(5);
    expect(isNaN(nan.compare(normal))).toBe(true);
    expect(isNaN(normal.compare(nan))).toBe(true);
});