import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import greaterThanOrEquals from "../comparison/greaterThanOrEquals";
import lessThan from "../comparison/lessThan";
import max from "../comparison/max";
import { MegotaConstants, PrimitiveConstants } from "../constants";
import toNumber from "../display/toNumber";
import modulo from "../multiplicative/modulo";
import mul from "../multiplicative/mul";
import reciprocal from "../multiplicative/reciprocal";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import abs from "../unary/abs";
import isInteger from "../unary/isInteger";
import negate from "../unary/negate";
import log10 from "./log10";
import root from "./root";
import tensPower from "./tensPower";

/**
 * Raises this number to the power of another number.
 * 
 * @param value The value number, represented as a {@link BaseMegota}.
 * @param exponent The exponent number, represented as a {@link BaseMegota}.
 */
function pow(value: BaseMegota, exponent: BaseMegota): void {

    if (equals(exponent, MegotaConstants.ZERO)) // x^0 = 1
        return paste(value, MegotaConstants.ONE);

    if (equals(exponent, MegotaConstants.ONE)) // x^1 = x
        return;

    if (lessThan(exponent, MegotaConstants.ZERO)) { // x^(-n) = 1/(x^n)
        const negatedExponent = clone(exponent);
        negate(negatedExponent);
        pow(value, negatedExponent);
        reciprocal(value);
        return;
    }

    if (lessThan(value, MegotaConstants.ZERO) && isInteger(exponent)) {
        abs(value);
        pow(value, exponent);

        const remainder = clone(exponent);
        modulo(remainder, MegotaConstants.TWO);
        if (greaterThanOrEquals(remainder, MegotaConstants.ONE)) {
            negate(value);
        }
        return;
    }

    if (lessThan(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.ONE))
        return paste(value, MegotaConstants.ONE);

    if (equals(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.ZERO);

    const maximum = max(value, exponent);
    if (greaterThan(maximum, MegotaConstants.TETRATED_MAX_SAFE_INTEGER))
        return paste(value, maximum);

    if (equals(value, MegotaConstants.TEN)) {
        paste(value, exponent);
        tensPower(value);
        return;
    }

    if (lessThan(exponent, MegotaConstants.ONE)) {
        const reciprocalExponent = clone(exponent);
        reciprocal(reciprocalExponent);
        root(value, reciprocalExponent);
        return;
    }

    const n = Math.pow(toNumber(value), toNumber(exponent));
    if (n <= PrimitiveConstants.MAX_SAFE_INTEGER) {
        fromNumber(n, value);
        return;
    }

    log10(value);
    mul(value, exponent);
    return tensPower(value);
}

export default pow;