import clone from "../clone";
import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThanOrEquals from "../comparison/lessThanOrEquals";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import normalize from "../normalize";
import iop from "../operator/iop";
import paste from "../paste";
import isInteger from "../unary/isInteger";
import arrow from "./arrow";

/**
 * Calculates the expansion of this MegotaNumber to another MegotaNumber.
 * 
 * Expansion refers to the binary function `a{{1}}b`, defined as `a{a{...{a}...}a}a   (with b total a's, nested from the center out)`
 * 
 * @example
 * Consider 2{{1}}3: This is equivalent to 2{2}2, or 2 tetrated to 2 = 4.
 * Consider 3{{1}}2: This is equivalent to 3{3{3}3}3, which is 3{7625597484987}3 (so 7625597484987 arrows).
 * 
 * @see https://googology.fandom.com/wiki/Expansion
 * 
 * @param value The number to expand
 * @param copiesCount The number of copies of this number in the expansion
 */
function expansion(value: BaseMegota, copiesCount: BaseMegota): void {

    // Input validations
    if (lessThanOrEquals(copiesCount, MegotaConstants.ZERO) || !isInteger(copiesCount))
        return paste(value, MegotaConstants.NaN);

    if (equals(copiesCount, MegotaConstants.ONE))
        return;

    if (!isInteger(value))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.TWO))
        return paste(value, MegotaConstants.FOUR);

    // Handle extremely large values separately
    if (greaterThan(copiesCount, MegotaConstants.MAX_SAFE_INTEGER)) {
        paste(value, copiesCount);
        iop(value, [1, 0], 1);
        normalize(value);
        return;
    }

    // Main computation loop - building the nested hyperoperation structure
    let result = value;
    let remainingIterations = toNumber(copiesCount) - 1;
    const MAX_ITERATIONS = 100; // Safety limit to prevent infinite loops

    for (let iterationCount = 0; remainingIterations !== 0 && iterationCount < MAX_ITERATIONS; ++iterationCount) {
        if (remainingIterations > 0) {
            // Apply the hyperoperation where the number of arrows is determined by the current result
            const r = clone(value);
            arrow(r, result, value);
            result = r;
            --remainingIterations;
        }
    }

    // If we couldn't process all iterations (due to reaching MAX_ITERATIONS),
    // adjust the coefficient of the final operator to account for the remaining iterations
    result.array[result.array.length - 1][2] += remainingIterations;
    normalize(result);
    paste(value, result);
}

export default expansion;