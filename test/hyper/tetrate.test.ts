import { expect, it } from '@jest/globals';
import Megota from '../../src/index';
it('tetrates 2^^3', () => {
    const base = new Megota(2);
    const height = new Megota(3);
    const result = base.tetrate(height);
    expect(result).toEqualMegota(new Megota('16'));
});
it('tetrates 3^^2', () => {
    const base = new Megota(3);
    const height = new Megota(2);
    const result = base.tetrate(height);
    expect(result).toEqualMegota(new Megota('27'));
});
it('tetrates 4^^1', () => {
    const base = new Megota(4);
    const height = new Megota(1);
    const result = base.tetrate(height);
    expect(result).toEqualMegota(new Megota('4'));
});
it('tetrates 5^^0', () => {
    const base = new Megota(5);
    const height = new Megota(0);
    const result = base.tetrate(height);
    expect(result).toEqualMegota(new Megota('1'));
});
it('tetrates 2^^4', () => {
    const base = new Megota('2');
    const height = new Megota('4');
    const result = base.tetrate(height);
    expect(result).toEqualMegota(new Megota('65536'));
});
it('tetrates 1^^n returns 1 for any n', () => {
    const base = new Megota(1);
    for (let i = 0; i <= 10; i++) {
        const height = new Megota(i);
        const result = base.tetrate(height);
        expect(result).toEqualMegota(new Megota('1'));
    }
});
it('tetrates 0^^n handles edge cases', () => {
    const base = new Megota(0);
    const heightZero = new Megota(0);
    expect(base.tetrate(heightZero).isNaN()).toBe(true);
    const heightOne = new Megota(1);
    expect(base.tetrate(heightOne)).toEqualMegota(new Megota('0'));
    const heightTwo = new Megota(2);
    expect(base.tetrate(heightTwo)).toEqualMegota(new Megota('1'));
});
