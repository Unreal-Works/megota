import { MegotaConstants } from "../../constants";
import gop from "../../operator/gop";
import fromNumber from "../../parsing/fromNumber";
import isFinite from "../../unary/isFinite";
import isNaN from "../../unary/isNaN";
import equals from "../equals";
import lessThan from "../lessThan";

/**
 * Checks if this MegotaNumber is equal to another MegotaNumber within a specified tolerance.
 * 
 * This method allows for a small margin of error when comparing two numbers, which is useful for
 * floating-point arithmetic where precision can be an issue.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The number represented as a {@link BaseMegota} to compare against.
 * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
 * @returns `true` if the numbers are considered equal within the specified tolerance, otherwise `false`.
 */
function equals_tolerance(value: BaseMegota, other: BaseMegota, tolerance = 1e-7): boolean {
    // Early returns for special cases
    if (isNaN(value) || isNaN(other) || isFinite(value) !== isFinite(other))
        return false;

    if (value.sign !== other.sign)
        return false;

    // Special case for numbers very close to zero
    if ((equals(value, MegotaConstants.ZERO) || equals(other, MegotaConstants.ZERO)) &&
        lessThan(value, fromNumber(tolerance), true) &&
        lessThan(other, fromNumber(tolerance), true)) {
        return true;
    }

    // Check layer difference - if more than 1, numbers are definitely different
    if (Math.abs(value.layer - other.layer) > 1)
        return false;

    // If layers differ by exactly 1, we need special handling
    if (value.layer !== other.layer) {
        const higherLayerNumber = value.layer > other.layer ? value : other;
        const lowerLayerNumber = value.layer > other.layer ? other : value;

        // Check if higher layer number has the specific structure required for possible equality
        if (!(higherLayerNumber.array.length === 2 &&
            higherLayerNumber.array[0][0] === 0 &&
            higherLayerNumber.array[0][1] === 0 &&
            higherLayerNumber.array[1][0] === 0 &&
            higherLayerNumber.array[1][1] === 1 &&
            higherLayerNumber.array[1][2] === 1))
            return false;

        // Calculate logarithmic values for comparison
        const a = higherLayerNumber.array[0][2];

        // Calculate corresponding logarithmic value for lower layer number
        const lastElem = lowerLayerNumber.array[lowerLayerNumber.array.length - 1];
        const b = lastElem[1] >= 10 ? Math.log10(lastElem[1] + 1) : Math.log10(lastElem[1]);

        // Compare with tolerance
        return Math.abs(a - b) <= tolerance * Math.max(Math.abs(a), Math.abs(b));
    }

    // For same layer, compare array elements
    const maxLength = Math.max(value.array.length, other.array.length);

    // Check if the highest operation types differ by more than 1
    if (Math.abs(value.array[value.array.length - 1][1] - other.array[other.array.length - 1][1]) > 1)
        return false;

    // Compare array elements from highest significance to lowest
    for (let i = 1; maxLength - i >= 0; i++) {
        const thisIdx = value.array.length - i;
        const otherIdx = other.array.length - i;

        // Skip if index is out of bounds for either array
        if (thisIdx < 0 || otherIdx < 0) continue;

        const thisElem = value.array[thisIdx];
        const otherElem = other.array[otherIdx];

        // Operation types differ
        if (thisElem[1] !== otherElem[1]) {
            // Values must differ by at most 1 for possible tolerance equality
            if (Math.abs(thisElem[1] - otherElem[1]) > 1)
                return false;

            const largerValueNum = thisElem[1] > otherElem[1] ? value : other;
            const smallerValueNum = thisElem[1] > otherElem[1] ? other : value;
            const largerValue = Math.max(thisElem[1], otherElem[1]);
            const largerIdx = largerValueNum.array.length - i;

            // Coefficient of larger operation type value must be small
            if (largerValueNum.array[largerIdx][2] > 1)
                return false;

            // Must be near base level for tolerance comparison
            if (largerIdx >= 3)
                return false;

            if (!(largerIdx < 2 ||
                (largerIdx === 2 &&
                    largerValueNum.array[0][0] === 0 &&
                    largerValueNum.array[0][1] === 0 &&
                    largerValueNum.array[1][0] === 0 &&
                    largerValueNum.array[1][1] === 1 &&
                    largerValueNum.array[1][2] === 1)))
                return false;

            // Calculate logarithmic values for comparison
            const a = largerValueNum.array[0][2];
            let b: number;

            if (largerValue === 1) {
                b = Math.log10(gop(smallerValueNum, [0, 0]));
            }
            else if (largerValue === 2 && gop(smallerValueNum, [0, 0]) >= 1e10) {
                b = Math.log10(gop(smallerValueNum, [0, 1]) + 2);
            }
            else if (gop(smallerValueNum, [0, largerValue - 2]) >= 10) {
                b = Math.log10(gop(smallerValueNum, [0, largerValue - 1]) + 1);
            }
            else {
                b = Math.log10(gop(smallerValueNum, [0, largerValue - 1]));
            }

            // Compare with tolerance
            return Math.abs(a - b) <= tolerance * Math.max(Math.abs(a), Math.abs(b));
        }

        // Same operation type, compare coefficients
        if (thisElem[2] !== otherElem[2]) {
            // Base values can be directly compared
            if (thisIdx === 0) {
                const a = thisElem[2];
                const b = otherElem[2];
                return Math.abs(a - b) <= tolerance * Math.max(Math.abs(a), Math.abs(b));
            }

            // Values must differ by at most 1 for possible tolerance equality
            if (Math.abs(thisElem[2] - otherElem[2]) > 1)
                return false;

            const highCoef = thisElem[2] > otherElem[2] ? value : other;
            const lowCoef = thisElem[2] > otherElem[2] ? other : value;
            const highIdx = highCoef.array.length - i;
            const opType = thisElem[1]; // Same for both

            // Must be near base level for tolerance comparison
            if (!(highIdx < 2 ||
                (highIdx === 2 &&
                    highCoef.array[0][0] === 0 &&
                    highCoef.array[0][1] === 0 &&
                    highCoef.array[1][0] === 0 &&
                    highCoef.array[1][1] === 1 &&
                    highCoef.array[1][2] === 1)))
                return false;

            // Calculate logarithmic values for comparison  
            const a = highCoef.array[0][2];
            let b: number;

            if (opType === 1) {
                b = Math.log10(gop(lowCoef, [0, 0]));
            }
            else if (opType === 2 && gop(lowCoef, [0, 0]) >= 1e10) {
                b = Math.log10(gop(lowCoef, [0, 1]) + 2);
            }
            else if (gop(lowCoef, [0, opType - 2]) >= 10) {
                b = Math.log10(gop(lowCoef, [0, opType - 1]) + 1);
            }
            else {
                b = Math.log10(gop(lowCoef, [0, opType - 1]));
            }

            // Compare with tolerance
            return Math.abs(a - b) <= tolerance * Math.max(Math.abs(a), Math.abs(b));
        }
    }

    // All compared elements match within tolerance
    return true;
};

export default equals_tolerance;