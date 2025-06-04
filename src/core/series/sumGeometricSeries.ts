import sub from "../additive/sub";
import clone from "../clone";
import { MegotaConstants } from "../constants";
import pow from "../exponential/pow";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";

/**
 * Calculates the sum of a geometric series.
 * 
 * The geometric series is defined as `S = a + ar + ar^2 + ... + ar^(n-1)`.
 * 
 * Use cases include calculating the total cost of items in a game with a geometric cost increase.
 * For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
 * 
 * @param terms The number of terms in the geometric series.
 * @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
 * @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
 * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
 * @returns The sum of the geometric series.
 */
function sumGeometricSeries(terms: BaseMegota, firstTerm: BaseMegota, ratio: BaseMegota, offset: BaseMegota): BaseMegota {

    const ratioPowOffset = clone(ratio);
    pow(ratioPowOffset, offset);

    const ratioPowTerms = clone(ratio);
    pow(ratioPowTerms, terms);
    const diff = clone(MegotaConstants.ONE);
    sub(diff, ratioPowTerms);

    const oneMinusRatio = clone(MegotaConstants.ONE);
    sub(oneMinusRatio, ratio);

    const result = clone(firstTerm);
    mul(result, ratioPowOffset);
    mul(result, diff);
    div(result, oneMinusRatio);

    return result;
}

export default sumGeometricSeries;