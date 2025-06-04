import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should compare numbers with different signs correctly', () => {
    const pos = new Megota(42);
    const neg = new Megota(-42);
    const zero = new Megota(0);

    expect(pos).toBeGreaterThanMegota(neg);
    expect(neg).toBeLessThanMegota(pos);
    expect(pos).toBeGreaterThanMegota(zero);
    expect(neg).toBeLessThanMegota(zero);
    expect(zero).toBeGreaterThanMegota(neg);
    expect(zero).toBeLessThanMegota(pos);
});
