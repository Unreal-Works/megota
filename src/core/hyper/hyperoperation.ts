import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import equals from "../comparison/equals";
import { MegotaConstants } from "../constants";
import mul from "../multiplicative/mul";
import arrow from "./arrow";

/**
 * Returns a hyperoperation function for the given level, starting from this MegotaNumber.
 * 
 * Common hyperoperations include:
 * - Level 0: Addition (this + other)
 * - Level 1: Multiplication (this * other)
 * - Level 2: Exponentiation (this ↑ other)
 * - Level 3: Tetration (this ↑↑ other)
 * - Level 4: Pentation (this ↑↑↑ other)
 * - ...and so on.
 * 
 * @see https://en.wikipedia.org/wiki/Hyperoperation
 * 
 * @param level The level of the hyperoperation.
 * @returns A function that takes another MegotaNumber and applies the hyperoperation.
 */
function hyperoperation(value: BaseMegota, level: BaseMegota, other: BaseMegota): void {
    if (equals(level, MegotaConstants.ZERO))
        return add(value, other);

    if (equals(level, MegotaConstants.ONE))
        return mul(value, other);

    level = clone(level);
    sub(level, MegotaConstants.TWO);
    return arrow(value, level, other);
}

export default hyperoperation;