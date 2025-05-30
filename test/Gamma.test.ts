import { describe, expect, it } from '@jest/globals';
import { f_gamma, factorials } from '../src/Gamma';

describe('Gamma Functions', () => {
    describe('factorials array', () => {
        it('should contain correct factorial values', () => {
            expect(factorials[0]).toBe(1); // 0!
            expect(factorials[1]).toBe(1); // 1!
            expect(factorials[5]).toBe(120); // 5!
            expect(factorials[10]).toBe(3628800); // 10!
        });
    });

    describe('f_gamma function', () => {
        it('should handle non-finite inputs', () => {
            expect(f_gamma(Infinity)).toBe(Infinity);
            expect(f_gamma(-Infinity)).toBe(-Infinity);
            expect(isNaN(f_gamma(NaN))).toBe(true);
        });

        it('should return 0 for negative non-integers < -50', () => {
            expect(f_gamma(-50.5)).toBe(0);
            expect(f_gamma(-51.5)).toBe(0);
            expect(f_gamma(-100.5)).toBe(0);
        });

        it('should correctly calculate gamma for positive values', () => {
            // Gamma(n) = (n-1)! for integer n
            expect(f_gamma(1)).toBeCloseTo(1); // Gamma(1) = 0!
            expect(f_gamma(2)).toBeCloseTo(1); // Gamma(2) = 1!
            expect(f_gamma(3)).toBeCloseTo(2); // Gamma(3) = 2!
            expect(f_gamma(4)).toBeCloseTo(6); // Gamma(4) = 3!
            expect(f_gamma(5)).toBeCloseTo(24); // Gamma(5) = 4!
            expect(f_gamma(6)).toBeCloseTo(120); // Gamma(6) = 5!
        });

        it('should correctly calculate gamma for non-integer positive values', () => {
            expect(f_gamma(1.5)).toBeCloseTo(Math.sqrt(Math.PI) / 2); // Gamma(1.5) = √π/2
            expect(f_gamma(2.5)).toBeCloseTo(0.75 * Math.sqrt(Math.PI)); // Gamma(2.5) = 3√π/4
        });
        
        it('should handle values that require the scaling logic', () => {
            expect(f_gamma(9.5)).toBeCloseTo(119292.46);
            expect(f_gamma(15.7)).toBeCloseTo(576296716000, -4);
        });

        it('should calculate values for very large inputs', () => {
            const largeValue = f_gamma(100);
            expect(largeValue).toBeGreaterThan(1e150);
            expect(isFinite(largeValue)).toBe(true);
        });
    });
});
