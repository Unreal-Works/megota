import '../../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../../src/index';

it('should compare values with tolerance', () => {
    const a = new Megota(5);
    const b = new Megota(5.0000001);
    const c = new Megota(6);
    expect(a.equals_tolerance(b, 0.001)).toBe(true);
    expect(a.equals_tolerance(c, 0.001)).toBe(false);
});
