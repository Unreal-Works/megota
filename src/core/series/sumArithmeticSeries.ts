import add from "../additive/add";
import sub from "../additive/sub";
import clone from "../clone";
import { MegotaConstants } from "../constants";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";

/**
 * Calculates the sum of an arithmetic series.
 * 
 * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + (n-1)d)`.
 * 
 * Use cases include calculating the total cost of items in a game with an arithmetic cost increase.
 * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
 * 
 * @param terms The number of terms in the arithmetic series.
 * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
 * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
 * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
 * @returns The sum of the arithmetic series.
 */
function sumArithmeticSeries(terms: BaseMegota, firstTerm: BaseMegota, difference: BaseMegota, offset: BaseMegota): BaseMegota {
    // Step 1: Calculate the actual starting term accounting for offset
    // actualFirstTerm = firstTerm + (offset * difference)
    const offsetMultiplier = clone(offset);
    mul(offsetMultiplier, difference);
    
    const actualFirstTerm = clone(firstTerm);
    add(actualFirstTerm, offsetMultiplier);

    // Step 2: Calculate the last term in the series
    // lastTerm = actualFirstTerm + ((terms - 1) * difference)
    const termIndexOfLast = clone(terms);
    sub(termIndexOfLast, MegotaConstants.ONE);
    
    const progressionToLast = clone(termIndexOfLast);
    mul(progressionToLast, difference);
    
    const lastTerm = clone(actualFirstTerm);
    add(lastTerm, progressionToLast);

    // Step 3: Apply arithmetic series sum formula: S = n * (first + last) / 2
    // This is equivalent to S = n/2 * (2a + (n-1)d) but more intuitive
    const sumOfFirstAndLast = clone(actualFirstTerm);
    add(sumOfFirstAndLast, lastTerm);
    
    const result = clone(terms);
    mul(result, sumOfFirstAndLast);
    div(result, MegotaConstants.TWO);

    return result;
}

export default sumArithmeticSeries;