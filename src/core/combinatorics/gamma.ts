import sub from "../additive/sub";
import clone from "../clone";
import greaterThan from "../comparison/greaterThan";
import { MegotaConstants } from "../constants";
import exp from "../exponential/exp";
import ln from "../exponential/ln";
import mul from "../multiplicative/mul";
import reciprocal from "../multiplicative/reciprocal";
import gop from "../operator/gop";
import fromNumber from "../parsing/fromNumber";


/**
 * Simple implementation of the gamma function in JavaScript.
 * 
 * @param n The number to calculate the gamma function for.
 * @returns The gamma function value for the given number `n`.
 */
function f_gamma(n: number): number {
    if (!isFinite(n))
        return n;

    if (n < -50) {
        if (n === Math.trunc(n))
            return Number.NEGATIVE_INFINITY;
        return 0;
    }

    let scal1 = 1;
    while (n < 10) {
        scal1 = scal1 * n;
        ++n;
    }
    n -= 1;
    let l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)
    l += (n + 0.5) * Math.log(n);
    l -= n;
    const n2 = n * n;
    let np = n;
    l += 1 / (12 * np);
    np *= n2;
    l -= 1 / (360 * np);
    np *= np * n2;
    l += 1 / (1260 * np);
    np *= n2;
    l -= 1 / (1680 * np);
    np *= n2;
    l += 1 / (1188 * np);
    np *= n2;
    l -= 691 / (360360 * np);
    np *= n2;
    l += 7 / (1092 * np);
    np *= n2;
    l -= 3617 / (122400 * np);
    return Math.exp(l) / scal1;
}

/**
 * Calculates the gamma function of this number.
 * 
 * The gamma function is defined as Γ(n) = (n-1)! for positive integers n.
 * However, it is also defined for non-integer values.
 * 
 * @see https://en.wikipedia.org/wiki/Gamma_function
 * 
 * @param value The number represented as a {@link BaseMegota} to calculate the gamma function for.
 */
function gamma(value: BaseMegota): void {

    if (greaterThan(value, MegotaConstants.TETRATED_MAX_SAFE_INTEGER))
        return;

    if (greaterThan(value, MegotaConstants.E_MAX_SAFE_INTEGER)) {
        exp(value);
        return;
    }

    if (greaterThan(value, MegotaConstants.MAX_SAFE_INTEGER)) {
        const valueLn = clone(value);
        ln(valueLn);
        sub(valueLn, MegotaConstants.ONE);
        mul(value, valueLn);
        exp(value);
        return;
    }

    const n = gop(value, [0, 0]);
    if (n > 1) {
        if (n < 24) {
            fromNumber(f_gamma(value.sign * n), value);
            return;
        }
        const t = n - 1;
        let l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)
        l += ((t + 0.5) * Math.log(t));
        l -= t;
        const n2 = t * t;
        let np = t;
        let lm = 12 * np;
        let adj = 1 / lm;
        let l2 = l + adj;
        if (l2 === l)
            return exp(fromNumber(l, value));
        l = l2;
        np *= n2;
        lm = 360 * np;
        adj = 1 / lm;
        l2 = l - adj;
        if (l2 === l)
            return exp(fromNumber(l, value));
        l = l2;
        np *= n2;
        lm = 1260 * np;
        let lt = 1 / lm;
        l += lt;
        np *= n2;
        lm = 1680 * np;
        lt = 1 / lm;
        l -= lt;
        return exp(fromNumber(l, value));
    }

    return reciprocal(value);
};

export default gamma;