import { describe, expect, it } from '@jest/globals';
import Megota from '../src';
import { MegotaConfiguration } from '../src/core/Configuration';

describe('maxOps', () => {
    it('should change maxOps when set', () => {
        const originalMaxOps = MegotaConfiguration.maxOps;
        MegotaConfiguration.maxOps = 50;
        expect(MegotaConfiguration.maxOps).toBe(50);
        MegotaConfiguration.maxOps = originalMaxOps;
    });

    it('should respect maxOps limit', () => {
        const originalMaxOps = MegotaConfiguration.maxOps;
        MegotaConfiguration.maxOps = 5;
        const complexNum = new Megota("10^10^10^10^10^10");
        expect(complexNum.array.length).toBeLessThanOrEqual(MegotaConfiguration.maxOps);
        MegotaConfiguration.maxOps = originalMaxOps;
    });
});

describe('serializeMode', () => {
    it('should change serializeMode when set', () => {
        const originalMode = MegotaConfiguration.serializeMode;
        MegotaConfiguration.serializeMode = 1;
        expect(MegotaConfiguration.serializeMode).toBe(1);
        MegotaConfiguration.serializeMode = originalMode;
    });
});