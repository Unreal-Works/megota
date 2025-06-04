import  sub from "../additive/sub";
import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import max from "../comparison/max";
import { MegotaConstants, PrimitiveConstants } from "../constants";
import toNumber from "../display/toNumber";
import log10 from "../exponential/log10";
import tensPower from "../exponential/tensPower";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import round from "../rounding/round";
import abs from "../unary/abs";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import negate from "../unary/negate";


const maxError = fromNumber(1e-9);

/**
 * Divides this number by another number.
 * 
 * This method handles division with special cases for signs, zero, infinity, and very large numbers.
 * For regular numbers, it uses the property that a/b = 10^(log10(a) - log10(b)) to compute the result.
 * 
 * @param value The number to be divided, represented as a {@link BaseMegota}.
 * @param divisor The number to divide by.
 */
function div(value: BaseMegota, divisor: BaseMegota): void {

    // Handle sign differences - if signs are different, result is negative
    if (value.sign * divisor.sign === -1) {
        const divisorClone = clone(divisor);
        abs(value);
        abs(divisorClone);
        div(value, divisorClone);
        negate(value);
        return;
    }

    // Both are negative, convert to positive division case
    if (value.sign === -1) {
        const divisorClone = clone(divisor);
        abs(value);
        abs(divisorClone);
        div(value, divisorClone);
        return;
    }

    // Handle special cases that return NaN:
    // - Either number is NaN
    // - Both numbers are infinite (∞/∞ is undefined)
    // - Both numbers are zero (0/0 is undefined)
    if (isNaN(value) || isNaN(divisor) ||
        (isInfinite(value) && isInfinite(divisor)) ||
        (equals(value, MegotaConstants.ZERO) && equals(divisor, MegotaConstants.ZERO)))
        return paste(value, MegotaConstants.NaN);

    // Division by zero results in infinity
    if (equals(divisor, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.POSITIVE_INFINITY);

    // Division by one returns the unchanged value
    if (equals(divisor, MegotaConstants.ONE))
        return;

    // Dividing equal numbers gives 1
    if (equals(value, divisor))
        return paste(value, MegotaConstants.ONE);

    // Infinity divided by a finite number is still infinity
    if (isInfinite(value))
        return;

    // Finite number divided by infinity is zero
    if (isInfinite(divisor))
        return paste(value, MegotaConstants.ZERO);

    // Shortcut for extremely large numbers: if either number is too large
    // - If value > divisor, result is approximately value
    // - If value < divisor, result is approximately zero
    if (greaterThan(max(value, divisor), MegotaConstants.EE_MAX_SAFE_INTEGER)) {
        if (greaterThan(value, divisor)) {
            paste(value, MegotaConstants.ZERO);
        }
        return;
    }

    // For normal-sized numbers, try direct calculation
    const directResult = toNumber(value) / toNumber(divisor);
    if (directResult <= PrimitiveConstants.MAX_SAFE_INTEGER) {
        fromNumber(directResult, value);
        return;
    }

    // For larger results, use logarithmic division:
    // a/b = 10^(log10(a) - log10(b))
    log10(value);
    const divisorLog = clone(divisor);
    log10(divisorLog);
    sub(value, divisorLog);
    tensPower(value);

    // Handle potential floating point issues by rounding to nearest integer if very close
    const rounded = clone(value);
    round(rounded);

    sub(rounded, value);
    abs(rounded); // Now rounded contains |value - rounded|
    if (lessThan(rounded, maxError, true)) {
        round(value);  // Round the original value directly
    }
}

export default div;