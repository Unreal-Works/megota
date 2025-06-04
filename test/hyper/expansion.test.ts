import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle expansion method', () => {
    const two = new Megota(2);
    expect(two.expansion(3)).toEqualMegota(new Megota(4)); // 2{{1}}3 = 2{2}2 = 2^^2 = 4
});
