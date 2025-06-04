import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import { MegotaConstants } from "../constants";
import exp from "../exponential/exp";
import ln from "../exponential/ln";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";
import reciprocal from "../multiplicative/reciprocal";
import gop from "../operator/gop";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import abs from "../unary/abs";
import isFinite from "../unary/isFinite";
import isNaN from "../unary/isNaN";
import isPositiveInfinity from "../unary/isPositiveInfinity";
import negate from "../unary/negate";


const OMEGA = 0.5671432904097838; //W(1,0)
const omega = fromNumber(OMEGA);

function f_lambertw(z: number, tol = 1e-10, principal = true): number {
    let w: number;
    if (!Number.isFinite(z))
        return z;

    if (principal) {
        if (z === 0)
            return z;
        if (z === 1)
            return OMEGA;

        if (z < 10)
            w = 0;
        else
            w = Math.log(z) - Math.log(Math.log(z));
    }
    else {
        if (z === 0)
            return -Infinity;
        if (z <= -0.1)
            w = -2;
        else
            w = Math.log(-z) - Math.log(-Math.log(-z));
    }

    for (let i = 0; i < 100; ++i) {
        const wn = (z * Math.exp(-w) + w * w) / (w + 1);
        if (Math.abs(wn - w) < tol * Math.abs(wn))
            return wn;
        w = wn;
    }
    throw new Error("Iteration failed to converge: " + z);
}

/**
 * Calculates the Lambert W function of this MegotaNumber.
 * 
 * The Lambert W function is defined as the inverse function of f(W) = W * e^W.
 * 
 * @see https://en.wikipedia.org/wiki/Halley%27s_method Uses Halley's method for numerical approximation.
 * 
 * @param principal If true, returns the principal branch of the Lambert W function (default is true).
 */
function halley_method(value: BaseMegota, tol = 1e-10, principal = true): void {
    if (!isFinite(value))
        return;

    let w: BaseMegota;
    if (principal === true) {
        if (equals(value, MegotaConstants.ZERO))
            return;

        if (equals(value, MegotaConstants.ONE))
            return paste(value, omega);

        w = clone(value);
        ln(w);
    }
    else {
        if (equals(value, MegotaConstants.ZERO))
            return paste(value, MegotaConstants.NEGATIVE_INFINITY);

        w = clone(value);
        negate(w);
        ln(w);
    }

    const tolerance = fromNumber(tol);

    for (let i = 0; i < 100; ++i) {
        const ew = clone(w);
        negate(ew);
        exp(ew);

        const wewz = clone(w);
        const ref = clone(value);
        mul(ref, ew);
        sub(wewz, ref);

        const dd = clone(w);
        add(dd, MegotaConstants.ONE);
        const denominator = clone(w);
        add(denominator, MegotaConstants.TWO);
        mul(denominator, wewz);
        const denominatorDiv = clone(MegotaConstants.TWO);
        mul(denominatorDiv, w);
        add(denominatorDiv, MegotaConstants.TWO);
        div(denominator, denominatorDiv);
        sub(dd, denominator);

        if (equals(dd, MegotaConstants.ZERO))
            return paste(value, w);

        const wn = clone(w);
        const subtractor = clone(wewz);
        div(subtractor, dd);
        sub(wn, subtractor);

        const convergence = clone(wn);
        sub(convergence, w);
        abs(convergence);

        const threshold = clone(wn);
        abs(threshold);
        mul(threshold, tolerance);
        if (lessThan(convergence, threshold)) // convergence check
            return paste(value, wn);

        w = wn;
    }
    throw new Error("Iteration failed to converge: " + value);
}

/**
 * Calculates the Lambert W function of value MegotaNumber.
 * 
 * The Lambert W function is defined as the inverse function of f(W) = W * e^W.
 * 
 * @see https://en.wikipedia.org/wiki/Lambert_W_function
 * 
 * @param principal If true, returns the principal branch of the Lambert W function (default is true).
 */
function lambertw(value: BaseMegota, principal = true): void {
    if (isNaN(value))
        return;

    if (lessThan(value, MegotaConstants.NEGATIVE_E_RECIP))
        return paste(value, MegotaConstants.NaN);

    if (principal) {
        if (greaterThan(value, MegotaConstants.TETRATED_MAX_SAFE_INTEGER))
            return;

        if (greaterThan(value, MegotaConstants.EE_MAX_SAFE_INTEGER)) {
            iop(value, [0, 1], -1);
            return;
        }

        if (greaterThan(value, MegotaConstants.MAX_SAFE_INTEGER))
            return halley_method(value);

        fromNumber(f_lambertw(value.sign * gop(value, [0, 0])), value);
        return;
    }

    if (isPositiveInfinity(value))
        return paste(value, MegotaConstants.NaN);


    if (greaterThan(value, MegotaConstants.EE_MAX_SAFE_INTEGER, true)) {
        negate(value);
        reciprocal(value);
        lambertw(value);
        negate(value);
        return;
    }

    if (greaterThan(value, MegotaConstants.MAX_SAFE_INTEGER, true))
        return halley_method(value, 1e-10, false);

    fromNumber(f_lambertw(value.sign * gop(value, [0, 0]), 1e-10, false), value);
    return;
}

export default lambertw;