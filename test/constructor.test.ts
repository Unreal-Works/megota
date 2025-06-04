import '../jest.setup';
import { describe, expect, it } from '@jest/globals';
import Megota from '../src/index';

describe('fromNumber', () => {
    it('should create a Megota from number', () => {
        const num = new Megota(5);
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(5);
        expect(num.layer).toBe(0);
    });

    it('should create a Megota from negative number', () => {
        const num = new Megota(-10);
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBe(10);
    });
});

describe('fromString', () => {
    it('should create a Megota from string', () => {
        const num = new Megota('12345');
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(12345);
    });

    it('should handle negative strings', () => {
        const num = new Megota('-67890');
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBe(67890);
    });

    it('should handle zero string', () => {
        const num = new Megota('0');
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(0);
    });
});

describe('fromJSON', () => {
    it('should handle JSON format inputs', () => {
        const original = new Megota(42);
        expect(new Megota(original.toJSON())).toEqualMegota(original);
    });
});

describe('scientificNotation', () => {
    it('should parse scientific notation', () => {
        const num = new Megota("1.23e5");
        expect(num.array[0][2]).toBeCloseTo(123000);
    });

    it('should handle negative signs in strings', () => {
        const num = new Megota("-5.678");
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBeCloseTo(5.678);
    });

    it('should parse special strings', () => {
        const nan = new Megota("NaN");
        expect(isNaN(nan.array[0][2])).toBe(true);
        const inf = new Megota("Infinity");
        expect(inf.array[0][2]).toBe(Infinity);
    });

    it('should handle scientific notation in various formats', () => {
        const cases = [
            { input: '1.23E45', expected: 45.089905111 },
            { input: '1.23e+45', expected: 45.089905111 },
            { input: '1.23e-5', expected: 0.0000123 },
            { input: '1E10', expected: 10000000000 },
            { input: '1e10', expected: 10000000000 }
        ];
        cases.forEach(({ input, expected }) => {
            const num = new Megota(input);
            expect(num.array[0][2]).toBeCloseTo(expected, expected < 1 ? 8 : 0);
        });
    });
});

describe('specialNotation', () => {
    it('should handle parsing of special notation formats', () => {
        const num1 = new Megota('10^10');
        expect(num1.array[0][2]).toBe(10000000000);
        const num2 = new Megota('10{1,2}5');
        expect(num2.array[0][2]).toBeGreaterThan(0);
        const num3 = new Megota('N10');
        expect(num3.greaterThan(new Megota('N9'))).toBe(true);
        const num4 = new Megota('N^3 10');
        expect(num4).toBeGreaterThanMegota(new Megota('N^2 10'));
        expect(num4).toBeGreaterThanMegota(new Megota('N^3 9'));
    });
});

describe('invalid', () => {
    it('should handle NaN values', () => {
        const num = new Megota(NaN);
        expect(isNaN(num.array[0][2])).toBe(true);
    });

    it('should handle infinity correctly', () => {
        const posInf = new Megota(Infinity);
        expect(posInf.array[0][2]).toBe(Infinity);
        const negInf = new Megota(-Infinity);
        expect(negInf.array[0][2]).toBe(Infinity);
        expect(negInf.sign).toBe(-1);
    });

    it('should handle malformed inputs', () => {
        const num = new Megota('not a number');
        expect(isNaN(num.array[0][2])).toBe(true);
    });
});