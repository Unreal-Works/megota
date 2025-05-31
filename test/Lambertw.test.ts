import { describe, expect, it } from '@jest/globals';
import { f_lambertw, LambertWError, OMEGA } from '../src/Lambertw';

describe('Lambert W Function', () => {

    describe('f_lambertw function', () => {
        it('should return correct values for finite inputs', () => {
            expect(f_lambertw(0)).toBe(0);
            expect(f_lambertw(1)).toBeCloseTo(OMEGA, 10);
            expect(f_lambertw(2)).toBeCloseTo(0.8526055020137255, 10);
            expect(f_lambertw(10)).toBeCloseTo(1.745528, 6);
        });

        it('should handle negative inputs correctly', () => {
            expect(f_lambertw(-0.1)).toBeCloseTo(-0.11183255915896297, 10);
        });

        it('should handle non-finite inputs', () => {
            expect(f_lambertw(Infinity)).toBe(Infinity);
            expect(f_lambertw(-Infinity)).toBe(-Infinity);
            expect(isNaN(f_lambertw(NaN))).toBe(true);
        });

        it('should throw LambertWError for non-converging cases', () => {
            expect(() => f_lambertw(-1000)).toThrow(LambertWError);
        });
    });
});