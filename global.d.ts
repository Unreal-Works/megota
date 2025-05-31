import '@jest/globals';
import 'jest-extended';
import type MegotaNumber from './src/MegotaNumber';

declare module 'expect' {
    interface Matchers<R> {
        /**
         * Asserts that the actual MegotaNumber is equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toEqualMegota(expected: MegotaNumber): R;

        /**
         * Asserts that the actual MegotaNumber is greater than the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeGreaterThanMegota(expected: MegotaNumber): R;

        /**
         * Asserts that the actual MegotaNumber is less than the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeLessThanMegota(expected: MegotaNumber): R;

        /**
         * Asserts that the actual MegotaNumber is greater than or equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeGreaterThanOrEqualMegota(expected: MegotaNumber): R;

        /**
         * Asserts that the actual MegotaNumber is less than or equal to the expected MegotaNumber.
         * @param expected The expected MegotaNumber.
         */
        toBeLessThanOrEqualMegota(expected: MegotaNumber): R;

        /**
         * Asserts that the actual MegotaNumber is close to the expected MegotaNumber within a specified precision.
         * @param expected The expected MegotaNumber.
         * @param precision The precision for comparison, default is 1e-7.
         */
        toBeCloseToMegota(expected: MegotaNumber, precision?: number): R;
    }
}