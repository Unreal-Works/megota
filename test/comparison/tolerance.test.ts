import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should compare with tolerance for very close numbers', () => {
    const a = new Megota(1);
    const b = new Megota(1.0000000001);
    const c = new Megota(1.1);

    expect(a.equals_tolerance(b, 1e-6)).toBe(true);
    expect(a.equals_tolerance(c, 1e-6)).toBe(false);
    expect(a.compare_tolerance(b, 1e-6)).toBe(0);
    expect(a.compare_tolerance(c, 1e-6)).toBe(-1);
    expect(a.greaterThanOrEquals_tolerance(b, 1e-6)).toBe(true);
    expect(a.lessThan_tolerance(c, 1e-6)).toBe(true);
});
