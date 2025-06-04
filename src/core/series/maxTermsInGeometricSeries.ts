import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import { MegotaConstants } from "../constants";
import log10 from "../exponential/log10";
import pow from "../exponential/pow";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";
import floor from "../rounding/floor";

/**
* Calculates the maximum number of terms in a geometric series that can be summed without exceeding a given limit.
* 
* The geometric series is defined as `S = a + ar + ar^2 + ... + ar^n`.
* 
* Use cases include how many times an item can be purchased in a game with a geometric cost increase.
* For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
* 
* @param sumLimit The maximum sum limit for the geometric series. In a game, this could be the amount of resources you have available to spend.
* @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
* @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
* @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
* @returns The maximum number of terms that can be purchased without exceeding the sum limit.
*/
function maxTermsInGeometricSeries(sumLimit: BaseMegota, firstTerm: BaseMegota, ratio: BaseMegota, offset: BaseMegota): BaseMegota {

    // ratio ^ offset * firstTerm
    const offsetAdjustedFirstTerm = clone(ratio);
    pow(offsetAdjustedFirstTerm, offset);
    mul(offsetAdjustedFirstTerm, firstTerm);

    // ratio - 1
    const ratioMinusOne = clone(ratio);
    sub(ratioMinusOne, MegotaConstants.ONE);

    // log10(ratio)
    const logRatio = clone(ratio);
    log10(logRatio);

    // General solution = (sumLimit / (firstTerm * (ratio ^ offset))) * (ratio - 1) + 1
    const maxTerms = clone(sumLimit);
    div(maxTerms, offsetAdjustedFirstTerm);
    mul(maxTerms, ratioMinusOne);
    add(maxTerms, MegotaConstants.ONE);
    log10(maxTerms);
    div(maxTerms, logRatio);

    // Floor since fractional terms do not count
    floor(maxTerms);

    return maxTerms;
}

export default maxTermsInGeometricSeries;