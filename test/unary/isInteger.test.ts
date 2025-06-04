import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should check if number is integer correctly', () => {
    const integer = new Megota(5);
    const nonInteger = new Megota(5.5);
    expect(integer.isInteger()).toBe(true);
    expect(nonInteger.isInteger()).toBe(false);
});
