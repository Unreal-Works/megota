import { expect, it } from '@jest/globals';
import Megota from '../../src/index';
it('should calculate factorial for small integers', () => {
    const a = new Megota(5);
    const result = a.factorial();
    expect(result).toEqualMegota(new Megota(120));
});
it('should calculate factorial for large integers', () => {
    const a = new Megota("20");
    const result = a.factorial();
    expect(result).toBeCloseToMegota(new Megota("2432902008176640000"));
});
it('should handle factorial of zero', () => {
    const a = new Megota(0);
    const result = a.factorial();
    expect(result).toEqualMegota(new Megota(1));
});
