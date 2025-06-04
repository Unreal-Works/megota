import { expect, it } from '@jest/globals';
import Megota from '../../src/index';

it('should handle basic numbers correctly', () => {
    expect(new Megota(42).toString()).toBe('42');
    expect(new Megota(-123).toString()).toBe('-123');
    expect(new Megota(0).toString()).toBe('0');
});

it('should handle special values correctly', () => {
    expect(new Megota(NaN).toString()).toBe('NaN');
    expect(new Megota(Infinity).toString()).toBe('Infinity');
    expect(new Megota(-Infinity).toString()).toBe('-Infinity');
});

it('should format large numbers with scientific notation', () => {
    expect(new Megota(1e15).toString()).toMatch(/e\+?15$/);

    // Test very large numbers
    const veryLarge = new Megota('1e1000');
    expect(veryLarge.toString()).toMatch(/e/);

    // Test numbers that need multiple 'e's
    const evenLarger = new Megota('1e1000000');
    const result = evenLarger.toString();
    expect(result.includes('e')).toBe(true);
});

it('should handle numbers with different layers', () => {
    // Create a number with layer 1
    const layeredNum = new Megota('N^2 1');
    expect(layeredNum.toString().startsWith('N')).toBe(true);

    // Test really big numbers with higher layers
    const reallyBig = new Megota('N^100 1');
    expect(reallyBig.toString().includes('N')).toBe(true);
});
