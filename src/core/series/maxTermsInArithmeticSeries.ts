import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import { MegotaConstants } from "../constants";
import pow from "../exponential/pow";
import sqrt from "../exponential/sqrt";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";
import floor from "../rounding/floor";

/**
 * Calculates the maximum number of terms in an arithmetic series that can be summed without exceeding a given limit.
 * 
 * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + nd)`.
 * 
 * Use cases include how many times an item can be purchased in a game with an arithmetic cost increase.
 * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
 * 
 * @param sumLimit The maximum sum limit for the arithmetic series. In a game, this could be the amount of resources you have available to spend.
 * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
 * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
 * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
 * @returns The maximum number of terms that can be purchased without exceeding the sum limit.
 */
function maxTermsInArithmeticSeries(sumLimit: BaseMegota, firstTerm: BaseMegota, difference: BaseMegota, offset: BaseMegota): BaseMegota {

    // firstTerm + offset * difference
    const offsetAdjustedFirstTerm = clone(offset);
    mul(offsetAdjustedFirstTerm, difference);
    add(offsetAdjustedFirstTerm, firstTerm);

    const halfDifference = clone(difference);
    div(halfDifference, MegotaConstants.TWO);

    // b = offsetAdjustedFirstTerm - (difference / 2)
    const b = clone(offsetAdjustedFirstTerm);
    sub(b, halfDifference);

    const b2 = clone(b);
    pow(b2, MegotaConstants.TWO);

    // difference * sumLimit * 2
    const twoDiffSum = clone(difference);
    mul(twoDiffSum, sumLimit);
    mul(twoDiffSum, MegotaConstants.TWO);

    // General solution = sqrt(b^2 + (difference * sumLimit * 2)) - b / difference
    add(b2, twoDiffSum);
    sqrt(b2);
    sub(b2, b);
    div(b2, difference);

    // Floor since fractional terms do not count
    floor(b2);

    return b2;
}

export default maxTermsInArithmeticSeries;