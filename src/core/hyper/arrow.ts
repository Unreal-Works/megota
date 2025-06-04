import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import max from "../comparison/max";
import { MegotaConfiguration } from "../Configuration";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import pow from "../exponential/pow";
import mul from "../multiplicative/mul";
import normalize from "../normalize";
import gop from "../operator/gop";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";
import fromString from "../parsing/fromString";
import paste from "../paste";
import isInteger from "../unary/isInteger";
import isNaN from "../unary/isNaN";
import tetrate from "./tetrate";


/**
 * Creates an arrow function for hyperoperations based on the number of arrows.
 * 
 * This function allows you to perform hyperoperations like multiplication, exponentiation, and tetration
 * based on the number of arrows specified.
 * 
 * Common hyperoperations:
 * - 0 arrows: Multiplication (a * b)
 * - 1 arrow: Exponentiation (a ↑ b)
 * - 2 arrows: Tetration (a ↑↑ b)
 * - 3 arrows: Pentation (a ↑↑↑ b)
 * - 4 arrows: Hexation (a ↑↑↑↑ b)
 * - ...
 * - 100 arrows: Decation (a ↑↑↑...↑ b, 100 times)
 * - ...and so on.
 * 
 */
function arrow(value: BaseMegota, arrows: BaseMegota, other: BaseMegota, depth = 0): void {

    if (!isInteger(arrows) || lessThan(arrows, MegotaConstants.ZERO) || isNaN(value) || isNaN(other))
        return paste(value, MegotaConstants.NaN);

    if (equals(arrows, MegotaConstants.ZERO)) {
        mul(value, other);
        return;
    }

    if (equals(arrows, MegotaConstants.ONE)) {
        pow(value, other);
        return;
    }

    if (equals(arrows, MegotaConstants.TWO)) {
        tetrate(value, other);
        return;
    }

    if (lessThan(other, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.ZERO)) {
        if (equals(other, MegotaConstants.ONE))
            return paste(value, MegotaConstants.ZERO);

        return paste(value, MegotaConstants.NaN);
    }

    if (equals(value, MegotaConstants.ONE) || equals(other, MegotaConstants.ONE))
        return;

    if (equals(other, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.ONE);


    let r: BaseMegota;
    if (greaterThan(arrows, MegotaConstants.MAX_SAFE_INTEGER)) {
        r = clone(arrows);
        r.array.push([1, 0, 1]);
        normalize(r);
        return paste(value, r);
    }

    const arrowsNum = toNumber(arrows);
    if (equals(other, MegotaConstants.TWO)) {
        arrow(value, fromNumber(arrowsNum - 1), clone(value), depth + 1);
    }

    const larger = max(value, other);

    if (greaterThan(larger, fromString("10{" + (arrowsNum + 1) + "}" + MegotaConstants.MAX_SAFE_INTEGER))) {
        return paste(value, larger);
    }

    const greaterThanMaxSafe = greaterThan(larger, fromString("10{" + arrowsNum + "}" + MegotaConstants.MAX_SAFE_INTEGER));

    if (greaterThanMaxSafe || greaterThan(other, MegotaConstants.MAX_SAFE_INTEGER)) {
        if (greaterThanMaxSafe) {
            iop(value, [0, arrowsNum], -1);
            normalize(value);
        }
        else if (greaterThan(other, fromString("10{" + (arrowsNum - 1) + "}" + MegotaConstants.MAX_SAFE_INTEGER))) {
            fromNumber(gop(value, [0, arrowsNum - 1]), value);
        }
        else {
            paste(value, MegotaConstants.ZERO);
        }

        add(value, other);
        iop(value, [0, arrowsNum], 1);
        normalize(value);
        return;
    }

    if (depth >= MegotaConfiguration.maxOps + 10) {
        value.sign = 1;
        value.layer = 0;
        value.array = [[0, 0, 10], [0, arrowsNum, 1]];
        normalize(value);
        return;
    }

    const y = toNumber(other);
    let f = Math.floor(y);

    const arrows_m1 = clone(arrows);
    sub(arrows_m1, MegotaConstants.ONE);

    r = clone(value);
    arrow(r, arrows_m1, fromNumber(y - f), depth + 1);

    let i: number, m: BaseMegota;
    for (i = 0, m = fromString("10{" + (arrowsNum - 1) + "}" + MegotaConstants.MAX_SAFE_INTEGER); f !== 0 && lessThan(r, m) && i < 100; ++i) {
        if (f > 0) {
            const r1 = clone(value);
            arrow(r1, arrows_m1, r, depth + 1);
            r = r1;
            --f;
        }
    }

    if (i == 100)
        f = 0;

    iop(r, [0, arrowsNum - 1], f);
    normalize(r);
    return;
}

export default arrow;