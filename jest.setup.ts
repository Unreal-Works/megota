import { expect } from '@jest/globals';
import * as matchers from 'jest-extended';
import MegotaNumber from './src/MegotaNumber';

expect.extend(matchers);

expect.extend({
    toEqualMegota(actual: unknown, expected: MegotaNumber) {
        const pass = (actual as MegotaNumber).equals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as MegotaNumber).toString()} not to equal ${expected.toString()}`
                    : `Expected ${(actual as MegotaNumber).toString()} to equal ${expected.toString()}`
        };
    },

    toBeGreaterThanMegota(actual: unknown, expected: MegotaNumber) {
        const pass = (actual as MegotaNumber).greaterThan(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as MegotaNumber).toString()} not to be greater than ${expected.toString()}`
                    : `Expected ${(actual as MegotaNumber).toString()} to be greater than ${expected.toString()}`
        };
    },

    toBeLessThanMegota(actual: unknown, expected: MegotaNumber) {
        const pass = (actual as MegotaNumber).lessThan(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as MegotaNumber).toString()} not to be less than ${expected.toString()}`
                    : `Expected ${(actual as MegotaNumber).toString()} to be less than ${expected.toString()}`
        };
    },

    toBeGreaterThanOrEqualMegota(actual: unknown, expected: MegotaNumber) {
        const pass = (actual as MegotaNumber).greaterThanOrEquals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as MegotaNumber).toString()} not to be greater than or equal to ${expected.toString()}`
                    : `Expected ${(actual as MegotaNumber).toString()} to be greater than or equal to ${expected.toString()}`
        };
    },

    toBeLessThanOrEqualMegota(actual: unknown, expected: MegotaNumber) {
        const pass = (actual as MegotaNumber).lessThanOrEquals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as MegotaNumber).toString()} not to be less than or equal to ${expected.toString()}`
                    : `Expected ${(actual as MegotaNumber).toString()} to be less than or equal to ${expected.toString()}`
        };
    },

    toBeCloseToMegota(actual: unknown, expected: MegotaNumber, precision: number = 1e-7) {
        const actualMegota = actual as MegotaNumber;
        const expectedMegota = expected as MegotaNumber;
        const pass = actualMegota.equals_tolerance(expectedMegota, precision);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actualMegota.toString()} not to be close to ${expectedMegota.toString()} with precision ${precision}`
                    : `Expected ${actualMegota.toString()} to be close to ${expectedMegota.toString()} with precision ${precision}`
        };
    }
});