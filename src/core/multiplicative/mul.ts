import add from "../additive/add";
import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import max from "../comparison/max";
import { MegotaConstants, PrimitiveConstants } from "../constants";
import toNumber from "../display/toNumber";
import log10 from "../exponential/log10";
import tensPower from "../exponential/tensPower";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import abs from "../unary/abs";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import negate from "../unary/negate";

/**
 * Multiplies this number by another number.
 * 
 * @param value The base number to multiply, represented as a {@link BaseMegota}.
 * @param other The other number to multiply with, represented as a {@link BaseMegota}.
 * @returns A new number that is the product of this and the other.
 */
function mul(value: BaseMegota, other: BaseMegota): void {
    if (value.sign * other.sign === -1) { // x * -y = -xy, -x * y = -xy
        const otherAbs = clone(other);
        abs(otherAbs);
        abs(value);
        mul(value, otherAbs);
        negate(value);
        return;
    }

    if (value.sign === -1) { // -x * -y = xy
        const otherAbs = clone(other);
        abs(otherAbs);
        abs(value);
        mul(value, otherAbs);
        return;
    }

    if (isNaN(value) || isNaN(other) || equals(value, MegotaConstants.ZERO) && isInfinite(other) || isInfinite(value) && equals(other, MegotaConstants.ZERO, true))
        return paste(value, MegotaConstants.NaN);

    if (equals(other, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.ZERO);

    if (equals(other, MegotaConstants.ONE))
        return;

    if (isInfinite(value))
        return;

    if (isInfinite(other))
        return paste(value, other);

    const maximum = max(value, other);
    if (greaterThan(maximum, MegotaConstants.EE_MAX_SAFE_INTEGER))
        return paste(value, maximum);

    const n = toNumber(value) * toNumber(other);
    if (n <= PrimitiveConstants.MAX_SAFE_INTEGER) {
        fromNumber(n, value);
        return;
    }

    log10(value);
    const otherLog = clone(other);
    log10(otherLog);
    add(value, otherLog);
    tensPower(value);
    return;
}

export default mul;