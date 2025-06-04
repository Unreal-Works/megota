import add from "../additive/add";
import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import lessThanOrEquals from "../comparison/lessThanOrEquals";
import max from "../comparison/max";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import ln from "../exponential/ln";
import log from "../exponential/log";
import pow from "../exponential/pow";
import div from "../multiplicative/div";
import normalize from "../normalize";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import lambertw from "../lambertw/lambertw";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import negate from "../unary/negate";
import slog from "./slog";


/**
 * Calculates the tetration of this MegotaNumber to another MegotaNumber.
 * 
 * Tetration is repeated exponentiation, defined as a power tower of height `other`.
 * 
 * @param other The height of the power tower.
 * @param payload An optional payload to adjust the result (default is 1).
 */
function tetrate(value: BaseMegota, other: BaseMegota, payload = MegotaConstants.ONE): void {

    if (!equals(payload, MegotaConstants.ONE)) {
        other = clone(other);
        payload = clone(payload);
        slog(payload, value);
        add(other, payload);
    }

    if (isNaN(value) || isNaN(other) || isNaN(payload))
        return paste(value, MegotaConstants.NaN);

    if (isInfinite(other) && other.sign > 0) {
        if (greaterThan(value, MegotaConstants.EXP_E_RECIP))
            return paste(value, MegotaConstants.POSITIVE_INFINITY);

        //Formula for infinite height power tower.
        ln(value);
        negate(value);
        const negLn = clone(value);
        lambertw(value);
        return div(value, negLn);
    }

    if (lessThanOrEquals(other, MegotaConstants.NEGATIVE_TWO))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.ZERO)) {
        if (equals(other, MegotaConstants.ZERO)) // 0^^0 is undefined
            return paste(value, MegotaConstants.NaN);

        if (equals(other, MegotaConstants.ONE))
            return paste(value, MegotaConstants.ZERO);

        return paste(value, MegotaConstants.ONE); // Cursed 0^0^0 tower, just resolve to 1
    }

    if (equals(value, MegotaConstants.ONE)) {
        if (equals(other, MegotaConstants.NEGATIVE_ONE))
            return paste(value, MegotaConstants.NaN);
        return paste(value, MegotaConstants.ONE);
    }

    if (equals(other, MegotaConstants.NEGATIVE_ONE))
        return paste(value, MegotaConstants.ZERO);

    if (equals(other, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.ONE);

    if (equals(other, MegotaConstants.ONE))
        return;

    if (equals(other, MegotaConstants.TWO)) { // x^^2 = x^x
        const exponent = clone(value);
        pow(value, exponent);
        return;
    }

    if (equals(value, MegotaConstants.TWO)) {
        if (equals(other, MegotaConstants.THREE)) { // 2^^3 = 16
            fromNumber(16, value);
            return;
        }

        if (equals(other, MegotaConstants.FOUR)) { // 2^^4 = 65536
            fromNumber(65536, value);
            return;
        }
    }

    const larger = max(value, other);
    if (greaterThan(larger, MegotaConstants.PENTATED_MAX_SAFE_INTEGER))
        return paste(value, larger);

    if (greaterThan(larger, MegotaConstants.TETRATED_MAX_SAFE_INTEGER) || greaterThan(other, MegotaConstants.MAX_SAFE_INTEGER)) {
        if (lessThan(value, MegotaConstants.EXP_E_RECIP)) {
            ln(value);
            negate(value);
            const negLn = clone(value);
            lambertw(value);
            div(value, negLn);
            return;
        }

        slog(value, MegotaConstants.TEN);
        add(value, other);

        iop(value, [0, 2], 1);
        normalize(value);
        return;
    }

    const y = toNumber(other);
    let f = Math.floor(y);
    let r = clone(value);
    pow(r, fromNumber(y - f));
    let l = MegotaConstants.NaN;

    let i: number;
    let w: BaseMegota;
    for (i = 0, w = MegotaConstants.E_MAX_SAFE_INTEGER; f !== 0 && lessThan(r, w) && i < 100; ++i) {
        const t = clone(value);
        if (f > 0) {
            pow(t, r);
            r = t;

            if (equals(l, r)) {
                f = 0;
                break;
            }
            l = r;
            --f;
        }
        else {
            log(t, r);
            r = t;

            if (equals(l, r)) {
                f = 0;
                break;
            }
            l = r;
            ++f;
        }
    }

    if (i == 100 || lessThan(value, MegotaConstants.EXP_E_RECIP)) {
        f = 0;
    }
    iop(r, [0, 1], f);
    normalize(r);
    paste(value, r);
    return;
}

export default tetrate;