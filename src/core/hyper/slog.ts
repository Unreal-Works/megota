import sub from "../additive/sub";
import clone from "../clone";
import compare from "../comparison/compare";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import lessThanOrEquals from "../comparison/lessThanOrEquals";
import max from "../comparison/max";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import log from "../exponential/log";
import pow from "../exponential/pow";
import normalize from "../normalize";
import gop from "../operator/gop";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import tetrate from "./tetrate";

/**
 * Calculates the super-logarithm of this number with respect to a specified base.
 * 
 * The super-logarithm is the inverse of tetration, defined as the height of the power tower needed to reach this number.
 * 
 * @param base The base for the super-logarithm (default is 10).
 */
function slog(value: BaseMegota, base = MegotaConstants.TEN): void {
    if (isNaN(value) || isNaN(base) || isInfinite(value) && isInfinite(base))
        return paste(value, MegotaConstants.NaN);

    if (isInfinite(value))
        return;

    if (isInfinite(base))
        return paste(value, MegotaConstants.ZERO);

    if (lessThan(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NEGATIVE_ONE);

    if (equals(value, MegotaConstants.ONE))
        return paste(value, MegotaConstants.ZERO);

    if (equals(value, base))
        return paste(value, MegotaConstants.ONE);

    if (lessThan(base, MegotaConstants.EXP_E_RECIP)) {
        const a = clone(base);
        tetrate(a, MegotaConstants.POSITIVE_INFINITY);
        const comparison = compare(value, a);
        if (comparison === 0)
            return paste(value, MegotaConstants.POSITIVE_INFINITY);
        else if (comparison > 0)
            return paste(value, MegotaConstants.NaN);
    }

    const larger = max(value, base);

    if (greaterThan(larger, MegotaConstants.PENTATED_MAX_SAFE_INTEGER)) {
        if (greaterThan(value, base))
            return;
        return paste(value, MegotaConstants.ZERO);
    }

    if (greaterThan(larger, MegotaConstants.TETRATED_MAX_SAFE_INTEGER)) {
        if (greaterThan(value, base)) {
            iop(value, [0, 2], -1);
            normalize(value);
            sub(value, fromNumber(gop(value, [0, 1])));
            return;
        }
        return paste(value, MegotaConstants.ZERO);
    }

    let r = 0;
    const t = (gop(value, [0, 1]) || 0) - (gop(base, [0, 1]) || 0);
    if (t > 3) {
        const l = t - 3;
        r += l;
        iop(value, [0, 1], -l);
    }

    let x = clone(value);
    for (let i = 0; i < 100; ++i) {
        if (lessThan(x, MegotaConstants.ZERO)) {
            const basePow = clone(base);
            pow(basePow, x);
            x = basePow;
            --r;
        }
        else if (lessThanOrEquals(x, MegotaConstants.ONE)) {
            fromNumber(r + toNumber(x) - 1, value);
            return;
        }
        else {
            ++r;
            log(x, base);
        }
    }

    if (greaterThan(x, MegotaConstants.TEN)) {
        return paste(value, fromNumber(r));
    }

    // If we reach here, it means we didn't converge to a solution.
    return paste(value, MegotaConstants.NaN);
}

export default slog;