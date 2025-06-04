import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle hyperoperation correctly', () => {
    const two = new Megota(2);
    expect(two.hyperoperation(2, 3)).toEqualMegota(new Megota(6));
});
