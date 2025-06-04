import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import max from "../comparison/max";
import { MegotaConstants } from "../constants";
import div from "../multiplicative/div";
import modulo from "../multiplicative/modulo";
import reciprocal from "../multiplicative/reciprocal";
import paste from "../paste";
import isInteger from "../unary/isInteger";
import negate from "../unary/negate";
import log10 from "./log10";
import pow from "./pow";
import tensPower from "./tensPower";

/**
 * Calculates the nth root of value MegotaNumber.
 * 
 * @param other The MegotaNumber representing the degree of the root.
 * @returns A new MegotaNumber that is the nth root of value number.
 */
function root(value: BaseMegota, other: BaseMegota): void {
    if (equals(other, MegotaConstants.ONE))
        return;

    if (lessThan(other, MegotaConstants.ZERO)) {
        const negatedOther = clone(other);
        negate(negatedOther);
        root(value, negatedOther);
        reciprocal(value);
        return;
    }

    if (lessThan(other, MegotaConstants.ONE)) {
        const reciprocalOther = clone(other);
        reciprocal(reciprocalOther);
        pow(value, reciprocalOther);
        return;
    }

    if (lessThan(value, MegotaConstants.ZERO) && isInteger(other)) {
        const remainder = clone(other);
        modulo(remainder, MegotaConstants.TWO);

        if (equals(remainder, MegotaConstants.ONE)) {
            negate(value);
            root(value, other);
            negate(value);
            return;
        }
    }

    if (lessThan(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.ONE))
        return paste(value, MegotaConstants.ONE);

    if (equals(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.ZERO);

    if (greaterThan(max(value, other), MegotaConstants.TETRATED_MAX_SAFE_INTEGER)) {
        if (greaterThan(value, other))
            paste(value, MegotaConstants.ZERO);
        return;
    }

    log10(value);
    div(value, other);
    return tensPower(value);
}

export default root;