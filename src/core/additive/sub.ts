import clone from "../clone";
import compare from "../comparison/compare";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import { MegotaConstants, PrimitiveConstants } from "../constants";
import toNumber from "../display/toNumber";
import div from "../multiplicative/div";
import normalize from "../normalize";
import gop from "../operator/gop";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import abs from "../unary/abs";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import negate from "../unary/negate";
import add from "./add";

/**
 * Handles common special cases for subtraction (equal numbers, zero, NaN).
 * 
 * @param value The target number that will be modified in place
 * @param other The number to subtract from value
 * @returns true if a special case was handled, false otherwise
 */
function handleSpecialCases(value: BaseMegota, other: BaseMegota): boolean {
    // Equal numbers result in zero
    if (equals(value, other)) {
        paste(value, MegotaConstants.ZERO);
        return true;
    }

    // Subtracting zero leaves the number unchanged
    if (equals(other, MegotaConstants.ZERO)) {
        return true;
    }

    // If either operand is NaN, the result is NaN
    if (isNaN(value) || isNaN(other)) {
        paste(value, MegotaConstants.NaN);
        return true;
    }

    return false;
}

/**
 * Handles mixed sign cases for subtraction by converting to appropriate operations.
 * 
 * @param value The target number that will be modified in place
 * @param other The number to subtract from value
 * @returns true if a mixed sign case was handled, false if both numbers are positive
 */
function handleMixedSigns(value: BaseMegota, other: BaseMegota): boolean {
    // -a - (-b) = -a + b = b - a
    if (value.sign === -1 && other.sign === -1) {
        abs(value);
        const otherClone = clone(other);
        abs(otherClone);
        sub(value, otherClone);
        negate(value);
        return true;
    }

    // -a - b = -(a + b)
    if (value.sign === -1) {
        const otherClone = clone(other);
        abs(value);
        add(otherClone, value);
        paste(value, otherClone);
        return true;
    }

    // a - (-b) = a + b
    if (other.sign === -1) {
        const otherClone = clone(other);
        abs(otherClone);
        add(value, otherClone);
        return true;
    }

    return false; // Both numbers are positive
}

/**
 * Handles infinity cases for subtraction.
 * 
 * @param value The target number that will be modified in place
 * @param other The number to subtract from value
 * @returns true if an infinity case was handled, false otherwise
 */
function handleInfinityCases(value: BaseMegota, other: BaseMegota): boolean {
    // Infinity - Infinity is undefined
    if (isInfinite(value) && isInfinite(other)) {
        paste(value, MegotaConstants.NaN);
        return true;
    }

    // Infinity - x = Infinity
    if (isInfinite(value)) {
        paste(value, MegotaConstants.POSITIVE_INFINITY);
        return true;
    }

    // x - Infinity = -Infinity
    if (isInfinite(other)) {
        paste(value, MegotaConstants.NEGATIVE_INFINITY);
        return true;
    }

    return false;
}

/**
 * Determines which number is larger and prepares for subtraction.
 * 
 * @param value The target number that will be modified in place
 * @param other The number to subtract from value
 * @returns An object containing comparison information or null if equal
 */
function prepareForSubtraction(value: BaseMegota, other: BaseMegota): { larger: BaseMegota, smaller: BaseMegota, resultSign: 1 | -1; } | null {

    const comparison = compare(value, other);

    // Equal numbers result in zero
    if (comparison === 0) {
        paste(value, MegotaConstants.ZERO);
        return null;
    }

    // Use type assertions to ensure proper types
    const resultSign = comparison > 0 ? 1 : -1;

    return {
        larger: comparison > 0 ? value : other,
        smaller: comparison > 0 ? other : value,
        resultSign: resultSign as 1 | -1
    };
}

/**
 * Handles numeric subtraction for small and large numbers.
 * 
 * @param value The target number that will be modified in place
 * @param larger The larger of the two operands
 * @param smaller The smaller of the two operands
 * @param resultSign The sign of the result (1 or -1)
 * @returns true if the subtraction was handled, false otherwise
 */
function handleNumericSubtraction(
    value: BaseMegota,
    larger: BaseMegota,
    smaller: BaseMegota,
    resultSign: 1 | -1,
    originalValue: BaseMegota,
    otherValue: BaseMegota
): boolean {
    // If one number dominates, return the larger one with appropriate sign
    const divided = clone(larger);
    div(divided, smaller);
    if (greaterThan(larger, MegotaConstants.E_MAX_SAFE_INTEGER) ||
        greaterThan(divided, MegotaConstants.MAX_SAFE_INTEGER)) {
        paste(value, larger);
        value.sign = resultSign;
        return true;
    }

    // For small numbers, direct subtraction is faster
    if (lessThan(larger, MegotaConstants.MAX_SAFE_INTEGER) &&
        lessThan(smaller, MegotaConstants.MAX_SAFE_INTEGER)) {
        fromNumber(toNumber(originalValue) - toNumber(otherValue), value);
        return true;
    }

    return false;
}

/**
 * Handles scientific notation subtraction for precision.
 * 
 * @param value The target number that will be modified in place
 * @param larger The larger of the two operands
 * @param smaller The smaller of the two operands
 * @param resultSign The sign of the result (1 or -1)
 * @param comparison The comparison result (> 0 if value > other)
 * @param originalValue The original value operand
 * @param otherValue The original other operand
 */
function handleScientificSubtraction(
    value: BaseMegota,
    larger: BaseMegota,
    smaller: BaseMegota,
    resultSign: 1 | -1,
    comparison: number,
    originalValue: BaseMegota,
    otherValue: BaseMegota
): void {
    const largerOp1 = gop(larger, [0, 1]);

    if (!largerOp1) {
        // Regular numbers
        fromNumber(toNumber(originalValue) - toNumber(otherValue), value);
        return;
    }

    if (largerOp1 === 1) {
        // Scientific notation (e.g., 1e10 - 1e9)
        const largerOp0 = gop(larger, [0, 0]);
        const smallerOp1 = gop(smaller, [0, 1]);

        if (smallerOp1) {
            // Both in scientific notation
            const smallerOp0 = gop(smaller, [0, 0]);
            const diff = largerOp0 - smallerOp0;

            // If the difference is significant, approximation is good enough
            if (diff > 15) {
                paste(value, larger);
                value.sign = resultSign;
                return;
            }

            // Calculate directly: smallerOp0 + log10(10^(diff) - 1)
            const newCoefficient = smallerOp0 + Math.log10(Math.pow(10, diff) - 1);

            // Create the result manually
            value.sign = resultSign;
            value.array = [[0, 0, newCoefficient], [0, 1, 1]];
            value.layer = 0;
            normalize(value);
        }
        else {
            // Only larger is in scientific notation
            const smallerValue = gop(smaller, [0, 0]);

            // For very large numbers compared to smaller ones, return larger with appropriate sign
            if (largerOp0 > Math.log10(smallerValue) + 15) {
                paste(value, larger);
                value.sign = resultSign;
                return;
            }

            // Calculate the actual result for closer numbers
            const directResult = comparison > 0 ?
                toNumber(originalValue) - toNumber(otherValue) :
                toNumber(otherValue) - toNumber(originalValue);

            if (Math.abs(directResult) <= PrimitiveConstants.MAX_SAFE_INTEGER) {
                fromNumber(directResult * resultSign, value);
                return;
            }

            // For larger differences where direct calculation isn't reliable
            // Calculate the difference for logarithmic subtraction
            const logDiff = largerOp0 - Math.log10(smallerValue);

            // Use logarithmic subtraction: 10^a - b = 10^a * (1 - b/10^a)
            const newCoefficient = largerOp0 + Math.log10(1 - Math.pow(10, -logDiff));

            // Create the result manually
            value.sign = resultSign;
            value.array = [[0, 0, newCoefficient], [0, 1, 1]];
            value.layer = 0;
            normalize(value);
        }
    }
    else {
        // Higher order operations (tetration, etc.)
        // For these cases, just return the larger number with appropriate sign
        paste(value, larger);
        value.sign = resultSign;
    }
}

/**
 * Subtracts the 'other' number from the 'value' number, modifying 'value' in place.
 * 
 * Handles various special cases:
 * - Equal numbers: Result is zero
 * - Zero: Subtracting zero leaves the number unchanged
 * - NaN: If either operand is NaN, the result is NaN
 * - Infinity: Special handling for infinite values
 * - Different signs: Converted to appropriate add/subtract operations
 * - Small numbers: Direct subtraction for better performance
 * - Large numbers: Approximations when appropriate
 * - Scientific notation: Special logarithmic subtraction to maintain precision
 * 
 * @param value The target number that will be modified in place, represented as a {@link BaseMegota}
 * @param other The number to subtract from 'value', represented as a {@link BaseMegota}
 */
function sub(value: BaseMegota, other: BaseMegota): void {
    // Handle common cases first for early returns
    if (handleSpecialCases(value, other)) {
        return;
    }

    // Handle sign differences
    if (handleMixedSigns(value, other)) {
        return;
    }

    // Both numbers are now positive
    // Handle infinity cases
    if (handleInfinityCases(value, other)) {
        return;
    }

    // Determine which number is larger and prepare for subtraction
    const subPrep = prepareForSubtraction(value, other);
    if (subPrep === null) {
        return; // Values were equal, result is zero
    }

    const { larger, smaller, resultSign } = subPrep;

    // Try numeric subtraction for small and large numbers
    if (handleNumericSubtraction(value, larger, smaller, resultSign, value, other)) {
        return;
    }

    // Use scientific notation and higher-order handling for more complex cases
    handleScientificSubtraction(value, larger, smaller, resultSign,
        compare(value, other), value, other);
}

export default sub;