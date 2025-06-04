import '../../jest.setup';
import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle arrow operations correctly', () => {
    const two = new Megota(2);
    expect(two.arrow(1, 3)).toEqualMegota(new Megota(8));
});

it('should handle basic arithmetic operations correctly', () => {
    // 0 arrows is multiplication
    expect(new Megota(2).arrow(0, 3)).toEqualMegota(new Megota(6));

    // 1 arrow is exponentiation
    expect(new Megota(2).arrow(1, 3)).toEqualMegota(new Megota(8));

    // 2 arrows is tetration
    expect(new Megota(2).arrow(2, 3)).toEqualMegota(new Megota(16));

    // 3 arrows is pentation
    const result = new Megota(2).arrow(3, 3);
    expect(result).toEqualMegota(new Megota(65536)); // 2↑↑↑3 = 2↑↑2↑↑2 = 2^2^2^2 = 65536 
});

it('should handle edge cases correctly', () => {
    // Test with NaN
    const nan = new Megota(NaN);
    expect(nan.arrow(1, 2).isNaN()).toBe(true);

    // Test with non-integer arrows
    const x = new Megota(2);
    expect(x.arrow(new Megota(1.5), 3).isNaN()).toBe(true);

    // Test with negative arrows
    expect(x.arrow(-1, 3).isNaN()).toBe(true);
});

it('should handle specific values for higher arrow operations', () => {
    // Test 2↑↑2 = 2^2 = 4
    expect(new Megota(2).arrow(2, 2)).toEqualMegota(new Megota(4));

    // Test 3↑↑2 = 3^3 = 27
    expect(new Megota(3).arrow(2, 2)).toEqualMegota(new Megota(27));

    // Test 2↑↑3 = 2^2^2 = 2^4 = 16
    expect(new Megota(2).arrow(2, 3)).toEqualMegota(new Megota(16));
});

it('should handle special values', () => {
    // Test 1 as base
    const one = new Megota(1);
    expect(one.arrow(1, 5)).toEqualMegota(one);
    expect(one.arrow(2, 5)).toEqualMegota(one);

    // Test 0 as base
    const zero = new Megota(0);
    expect(zero.arrow(1, 5)).toEqualMegota(zero);

    // Test with zero exponent
    expect(new Megota(3).arrow(1, 0)).toEqualMegota(new Megota(1));
    expect(new Megota(3).arrow(2, 0)).toEqualMegota(new Megota(1));
});