/// <reference types="../../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../../src/MegotaNumber';

describe('construction', () => {
    it('should create a MegotaNumber from number', () => {
        const num = MegotaNumber.fromNumber(5);
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(5);
        expect(num.layer).toBe(0);
    });

    it('should create a MegotaNumber from negative number', () => {
        const num = MegotaNumber.fromNumber(-10);
        expect(num.sign).toBe(-1);
        expect(num.array[0][2]).toBe(10);
    });

    it('should create a MegotaNumber from string', () => {
        const num = MegotaNumber.fromString("5");
        expect(num.sign).toBe(1);
        expect(num.array[0][2]).toBe(5);
    });

    it('should handle zero correctly', () => {
        const num = MegotaNumber.fromNumber(0);
        expect(num.sign).toBe(1);
        expect(num.array).toEqual([[0, 0, 0]]);
    });

    it('should handle NaN values', () => {
        const num = MegotaNumber.fromNumber(NaN);
        expect(isNaN(num.array[0][2])).toBe(true);
    });

    it('should handle infinity correctly', () => {
        const posInf = MegotaNumber.fromNumber(Infinity);
        expect(posInf.array[0][2]).toBe(Infinity);

        const negInf = MegotaNumber.fromNumber(-Infinity);
        expect(negInf.array[0][2]).toBe(Infinity);
        expect(negInf.sign).toBe(-1);
    });
});