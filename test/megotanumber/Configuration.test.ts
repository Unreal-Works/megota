/// <reference types="../../global.d.ts" />

import { describe, expect, it } from '@jest/globals';
import MegotaNumber from '../../src/MegotaNumber';

describe('configurations', () => {
    it('should change maxOps when set', () => {
        const originalMaxOps = MegotaNumber.maxOps;
        MegotaNumber.maxOps = 50;
        expect(MegotaNumber.maxOps).toBe(50);
        MegotaNumber.maxOps = originalMaxOps;
    });

    it('should change serializeMode when set', () => {
        const originalMode = MegotaNumber.serializeMode;
        MegotaNumber.serializeMode = 1;
        expect(MegotaNumber.serializeMode).toBe(1);
        MegotaNumber.serializeMode = originalMode;
    });
});

describe('configuration changes', () => {
    it('should respect maxOps limit', () => {
        const originalMaxOps = MegotaNumber.maxOps;
        MegotaNumber.maxOps = 5;

        // Create a number that would exceed maxOps
        const complexNum = MegotaNumber.fromString("10^10^10^10^10^10");

        // Verify the operations were limited
        expect(complexNum.array.length).toBeLessThanOrEqual(MegotaNumber.maxOps);

        // Restore original maxOps
        MegotaNumber.maxOps = originalMaxOps;
    });
});