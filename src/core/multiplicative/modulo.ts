import sub from "../additive/sub";
import clone from "../clone";
import equals from "../comparison/equals";
import { MegotaConstants } from "../constants";
import paste from "../paste";
import floor from "../rounding/floor";
import abs from "../unary/abs";
import isNaN from "../unary/isNaN";
import negate from "../unary/negate";
import div from "./div";
import mul from "./mul";

/**
 * Calculates the modulo of this number with another number.
 * 
 * Note that this is not the same as the modulus operation in mathematics
 * and returns the remainder of the division of this number by the other.
 * 
 * Hence, operations like `-7 % 3` will yield `-1`, not `2`.
 * 
 * @param value The number to calculate the modulo for, represented as a {@link BaseMegota}.
 * @param other The other number to calculate the modulo with, represented as a {@link BaseMegota}.
 */
function modulo(value: BaseMegota, other: BaseMegota): void {
    if (isNaN(other) || equals(other, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (equals(other, MegotaConstants.POSITIVE_INFINITY))
        return;

    if (value.sign * other.sign === -1) {
        const cloneOther = clone(other);
        abs(cloneOther);
        abs(value);
        modulo(value, cloneOther);
        negate(value);
        return;
    }

    if (value.sign === -1) {
        const cloneOther = clone(other);
        abs(cloneOther);
        abs(value);
        modulo(value, cloneOther);
        return;
    }

    const quotient = clone(value);
    div(quotient, other);
    floor(quotient);
    mul(quotient, other);
    sub(value, quotient);
    return;
}

export default modulo;