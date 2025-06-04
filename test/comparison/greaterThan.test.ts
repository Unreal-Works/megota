import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle greaterThan and greaterThanOrEquals', () => {
    const a = new Megota(5);
    const b = new Megota(10);
    const c = new Megota(5);

    expect(b).toBeGreaterThanMegota(a);
    expect(a).not.toBeGreaterThanMegota(b);
    expect(a).toBeGreaterThanOrEqualMegota(c);
    expect(a).not.toBeGreaterThanOrEqualMegota(b);
});
