import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should create from ExpantaNum-style array', () => {
    const num = Megota.fromExpantaNum([[0, 5]]);
    expect(num).toEqualMegota(new Megota(5));
});

it('should handle empty arrays', () => {
    const num = Megota.fromExpantaNum([]);
    expect(num).toEqualMegota(new Megota(0));
});