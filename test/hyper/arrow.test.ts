import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle arrow operations correctly', () => {
    const two = new Megota(2);
    expect(two.arrow(1, 3)).toEqualMegota(new Megota(8));
});
