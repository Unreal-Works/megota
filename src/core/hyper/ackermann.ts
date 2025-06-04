import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import { MegotaConstants } from "../constants";
import paste from "../paste";
import arrow from "./arrow";

/**
 * Calculates the Ackermann function for this MegotaNumber.
 * 
 * The Ackermann function can be defined as: `A(m, n) = (2 ^^...^ (n + 3)) - 3`, where the number of arrows is `m - 2`.
 * 
 * @see https://en.wikipedia.org/wiki/Ackermann_function
 * 
 * @param value The first parameter of the Ackermann function, which determines the number of arrows.
 * @param n The second parameter of the Ackermann function, which is the base number.
 */
function ackermann(value: BaseMegota, n: BaseMegota): void {
    // Rewritten as 2{x-2}(y+3) - 3

    const result = clone(MegotaConstants.TWO);

    const arrows = value;
    sub(arrows, MegotaConstants.TWO);

    const nPlusThree = clone(n);
    add(nPlusThree, MegotaConstants.THREE);

    arrow(result, arrows, nPlusThree);

    sub(result, MegotaConstants.THREE);

    paste(value, result);
};

export default ackermann;