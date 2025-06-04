import clone from "../clone";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import { MegotaConstants } from "../constants";
import ln from "../exponential/ln";
import div from "../multiplicative/div";
import iop from "../operator/iop";
import paste from "../paste";
import lambertw from "../lambertw/lambertw";
import isFinite from "../unary/isFinite";

/**
 * Calculates the square super-root of this MegotaNumber. This is **NOT** the same as normal square root.
 * 
 * The square super-root is an inverse operation to tetration, defined as the solution to the equation `x ↑↑ 2 = this`.
 * 
 * @see https://en.wikipedia.org/wiki/Super-root
 * 
 * @returns A new MegotaNumber that is the super-square root of this number.
 */
function ssqrt(value: BaseMegota): void {
    if (lessThan(value, MegotaConstants.EXP_NEGATIVE_E_RECIP))
        return paste(value, MegotaConstants.NaN);

    if (!isFinite(value))
        return;

    if (greaterThan(value, MegotaConstants.TETRATED_MAX_SAFE_INTEGER))
        return;

    if (greaterThan(value, MegotaConstants.EE_MAX_SAFE_INTEGER)) {
        iop(value, [0, 1], -1);
        return;
    }

    ln(value);

    const w = clone(value);
    lambertw(w);
    div(value, w);
    return;
}

export default ssqrt;