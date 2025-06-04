import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should calculate combinations correctly', () => {
    const n = new Megota(5);
    const k = new Megota(2);
    const result = n.choose(k);
    expect(result).toEqualMegota(new Megota(10));
});

it('should handle special choose cases', () => {
    const n = new Megota(5);
    const zero = new Megota(0);
    const same = new Megota(5);
    expect(n.choose(zero)).toEqualMegota(new Megota(1));
    expect(n.choose(same)).toEqualMegota(new Megota(1));
});

it('should calculate larger combinations correctly', () => {
    const n = new Megota(15);
    const k = new Megota(4);
    expect(n.choose(k)).toEqualMegota(new Megota(1365));
    const n2 = new Megota(20);
    const k2 = new Megota(10);
    expect(n2.choose(k2)).toEqualMegota(new Megota(184756));
});

it('should handle the symmetry property: nCk = nC(n-k)', () => {
    const n = new Megota(7);
    const k = new Megota(2);
    const nMinusK = new Megota(5);
    expect(n.choose(k)).toEqualMegota(n.choose(nMinusK));
});

it('should handle edge cases', () => {
    const one = new Megota(1);
    expect(one.choose(one)).toEqualMegota(new Megota(1));
    const zero = new Megota(0);
    expect(one.choose(zero)).toEqualMegota(new Megota(1));
});

it('should be less than 1 for k > n', () => {
    const n = new Megota(3);
    const k = new Megota(5);
    const result = n.choose(k);
    expect(result).toBeLessThanMegota(new Megota(1));
});
