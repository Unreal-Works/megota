import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import { MegotaConstants } from "../constants";
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
import sub from "./sub";

/**
 * Handles the zero and NaN special cases for addition.
 * 
 * @param value The first operand
 * @param other The second operand
 * @returns true if special case was handled, false otherwise
 */
function handleZeroAndNaN(value: BaseMegota, other: BaseMegota): boolean {
    if (equals(value, MegotaConstants.ZERO) || isNaN(other)) {
        // 0+y = y, x+NaN = NaN
        paste(value, other);
        return true;
    }

    if (equals(other, MegotaConstants.ZERO) || isNaN(value)) {
        // x+0 = x, NaN+y = NaN
        return true;
    }

    return false;
}

/**
 * Handles the infinity edge cases for addition.
 * 
 * @param value The first operand
 * @param other The second operand
 * @returns true if infinity case was handled, false otherwise
 */
function handleInfinityCases(value: BaseMegota, other: BaseMegota): boolean {
    const thisIsInfinite = isInfinite(value);
    const otherIsInfinite = isInfinite(other);

    if (thisIsInfinite === true) {
        if (otherIsInfinite === true) {
            if (value.sign === other.sign) {
                return true; // Both infinities of the same sign, value remains unchanged
            } else {
                paste(value, MegotaConstants.NaN); // Infinity + (-Infinity) is undefined
                return true;
            }
        }
    }

    if (otherIsInfinite === true) {
        // `value` is finite, `other` is infinite
        paste(value, other); // Return the other infinity
        return true;
    }

    return false;
}

/**
 * Handles common number addition cases for small and large numbers.
 * 
 * @param value The first operand (modified in place)
 * @param other The second operand
 * @returns true if the addition was handled, false otherwise
 */
function handleSimpleNumericAddition(value: BaseMegota, other: BaseMegota): boolean {
    // For small numbers, direct addition is faster
    if (lessThan(value, MegotaConstants.MAX_SAFE_INTEGER) && lessThan(other, MegotaConstants.MAX_SAFE_INTEGER)) {
        fromNumber(toNumber(value) + toNumber(other), value);
        return true;
    }

    // For large numbers, determine which is larger
    const larger = greaterThan(value, other) ? value : other;
    const smaller = larger === value ? other : value;

    // If one number dominates, return the larger one
    const divided = clone(larger);
    div(divided, smaller);
    if (greaterThan(larger, MegotaConstants.E_MAX_SAFE_INTEGER) || greaterThan(divided, MegotaConstants.MAX_SAFE_INTEGER)) {
        paste(value, larger);
        return true;
    }

    return false;
}

/**
 * Handles scientific notation and higher order operations for addition.
 * 
 * @param value The first operand (modified in place)
 * @param other The second operand
 */
function handleScientificAndHigherOrderAddition(value: BaseMegota, other: BaseMegota): void {
    // For large numbers, determine which is larger (needed for the operator calls)
    const larger = greaterThan(value, other) ? value : other;
    const smaller = larger === value ? other : value;

    // Handle scientific notation cases
    const largerOp1 = gop(larger, [0, 1]);

    if (largerOp1 === 0) {
        // Regular numbers
        fromNumber(toNumber(value) + toNumber(other), value);
        return;
    }
    else if (largerOp1 === 1) {
        // Scientific notation (e.g., 1e10 + 1e9)
        handleScientificNotationAddition(value, larger, smaller);
        return;
    }

    // Higher order operations (e.g., tetration)
    paste(value, larger);
}

/**
 * Handles addition where at least one operand is in scientific notation.
 * 
 * @param value The result number (modified in place)
 * @param larger The larger of the two operands
 * @param smaller The smaller of the two operands
 */
function handleScientificNotationAddition(value: BaseMegota, larger: BaseMegota, smaller: BaseMegota): void {
    const largerOp0 = gop(larger, [0, 0]);
    const smallerOp1 = gop(smaller, [0, 1]);

    if (smallerOp1) {
        // Both in scientific notation
        const smallerOp0 = gop(smaller, [0, 0]);
        const diff = largerOp0 - smallerOp0;

        // If the difference is significant, approximation is good enough
        if (diff > 15) {
            paste(value, larger);
            return;
        }

        // 10^(x+log(10^diff+1)) = 10^x+10^y
        const newCoefficient = smallerOp0 + Math.log10(Math.pow(10, diff) + 1);

        value.sign = 1;
        value.array = [[0, 0, newCoefficient], [0, 1, 1]];
        value.layer = 0;
        normalize(value);
    }
    else {
        // Only larger is in scientific notation
        const smallerValue = gop(smaller, [0, 0]);

        // If smaller is negligible compared to larger, return larger
        if (largerOp0 > Math.log10(smallerValue) + 15) {
            paste(value, larger);
            return;
        }

        const newCoefficient = largerOp0 + Math.log10(1 + Math.pow(10, -largerOp0) * smallerValue);

        value.sign = 1;
        value.array = [[0, 0, newCoefficient], [0, 1, 1]];
        value.layer = 0;
        normalize(value);
    }
}

/**
 * Handles mixed sign cases for addition by converting to appropriate operations.
 * 
 * @param value The first operand (modified in place)
 * @param other The second operand
 * @returns true if mixed sign case was handled, false if both numbers are positive
 */
function handleMixedSigns(value: BaseMegota, other: BaseMegota): boolean {
    // Both negative: -(|a| + |b|)
    if (value.sign === -1 && other.sign === -1) {
        const otherAbs = clone(other);
        abs(value);
        abs(otherAbs);
        add(value, otherAbs);
        negate(value);
        return true;
    }

    // First negative: b - |a|
    if (value.sign === -1) {
        const otherClone = clone(other);
        abs(value);
        sub(otherClone, value);
        paste(value, otherClone);
        return true;
    }

    // Second negative: a - |b|
    if (other.sign === -1) {
        const otherAbs = clone(other);
        abs(otherAbs);
        sub(value, otherAbs);
        return true;
    }

    return false; // Both numbers are positive
}

/**
 * Adds the 'other' number to the 'value' number, modifying 'value' in place.
 * 
 * Handles various special cases:
 * - NaN: If either operand is NaN, the result is NaN
 * - Zero: Adding zero to any number returns the number unchanged
 * - Infinity: Special handling for infinite values
 * - Different signs: Converted to appropriate add/subtract operations
 * - Small numbers: Direct addition for better performance
 * - Large numbers: Approximations when appropriate
 * - Scientific notation: Special logarithmic addition to maintain precision
 * 
 * @param value The target number that will be modified in place, represented as a {@link BaseMegota}
 * @param other The number to add to 'value', represented as a {@link BaseMegota}
 */
function add(value: BaseMegota, other: BaseMegota): void {
    // Handle common cases first for early returns
    if (handleZeroAndNaN(value, other)) {
        return;
    }

    // Handle infinity cases
    if (handleInfinityCases(value, other)) {
        return;
    }

    // Handle sign differences
    if (handleMixedSigns(value, other)) {
        return;
    }    // Both numbers are now positive

    // Handle small and large number cases
    if (handleSimpleNumericAddition(value, other)) {
        return;
    }    // Handle remaining cases (scientific notation and higher order operations)
    handleScientificAndHigherOrderAddition(value, other);
};

export default add;