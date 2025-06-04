import { expect } from '@jest/globals';
import * as matchers from 'jest-extended';
import Megota from './src/index';

declare module 'expect' {
    interface Matchers<R> {
        /**
         * Asserts that the actual MegotaNumber is equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toEqualMegota(expected: Megota): R;

        /**
         * Asserts that the actual MegotaNumber is greater than the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeGreaterThanMegota(expected: Megota): R;

        /**
         * Asserts that the actual MegotaNumber is less than the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeLessThanMegota(expected: Megota): R;

        /**
         * Asserts that the actual MegotaNumber is greater than or equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeGreaterThanOrEqualMegota(expected: Megota): R;

        /**
         * Asserts that the actual MegotaNumber is less than or equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeLessThanOrEqualMegota(expected: Megota): R;

        /**
         * Asserts that the actual MegotaNumber is close to the expected MegotaNumber within a specified precision.
         * @param expected The expected MegotaNumber.
         * @param precision The precision for comparison, default is 1e-7.
         */
        toBeCloseToMegota(expected: Megota, precision?: number): R;
    }
}

expect.extend(matchers);

expect.extend({
    toEqualMegota(actual: unknown, expected: Megota) {
        const pass = (actual as Megota).equals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as Megota).toString()} not to equal ${expected.toString()}`
                    : `Expected ${(actual as Megota).toString()} to equal ${expected.toString()}`
        };
    },

    toBeGreaterThanMegota(actual: unknown, expected: Megota) {
        const pass = (actual as Megota).greaterThan(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as Megota).toString()} not to be greater than ${expected.toString()}`
                    : `Expected ${(actual as Megota).toString()} to be greater than ${expected.toString()}`
        };
    },

    toBeLessThanMegota(actual: unknown, expected: Megota) {
        const pass = (actual as Megota).lessThan(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as Megota).toString()} not to be less than ${expected.toString()}`
                    : `Expected ${(actual as Megota).toString()} to be less than ${expected.toString()}`
        };
    },

    toBeGreaterThanOrEqualMegota(actual: unknown, expected: Megota) {
        const pass = (actual as Megota).greaterThanOrEquals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as Megota).toString()} not to be greater than or equal to ${expected.toString()}`
                    : `Expected ${(actual as Megota).toString()} to be greater than or equal to ${expected.toString()}`
        };
    },

    toBeLessThanOrEqualMegota(actual: unknown, expected: Megota) {
        const pass = (actual as Megota).lessThanOrEquals(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${(actual as Megota).toString()} not to be less than or equal to ${expected.toString()}`
                    : `Expected ${(actual as Megota).toString()} to be less than or equal to ${expected.toString()}`
        };
    },

    toBeCloseToMegota(actual: unknown, expected: Megota, precision: number = 1e-7) {
        const actualMegota = actual as Megota;
        const expectedMegota = expected as Megota;
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