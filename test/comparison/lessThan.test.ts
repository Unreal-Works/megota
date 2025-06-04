import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle lessThan and lessThanOrEquals', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const c = new Megota(5);

    expect(a).toBeLessThanMegota(b);
    expect(b).not.toBeLessThanMegota(a);
    expect(a).toBeLessThanOrEqualMegota(c);
    expect(b).not.toBeLessThanOrEqualMegota(a);
});
