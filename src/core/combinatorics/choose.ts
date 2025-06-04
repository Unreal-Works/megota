import sub from "../additive/sub";
import clone from "../clone";
import div from "../multiplicative/div";
import mul from "../multiplicative/mul";
import round from "../rounding/round";
import isInteger from "../unary/isInteger";
import factorial from "./factorial";

/**
 * Calculates the binomial coefficient, also known as "n choose k".
 * 
 * @param value The number of items to choose from, represented as a {@link BaseMegota}.
 * @param k The number of items to choose.
 */
function choose(value: BaseMegota, k: BaseMegota): void {
    const valueIsInteger = isInteger(value);

    const valueSubK = clone(value);
    sub(valueSubK, k);
    factorial(valueSubK);

    const kFactorial = clone(k);
    factorial(kFactorial);

    mul(kFactorial, valueSubK);

    factorial(value);
    div(value, kFactorial);

    if (valueIsInteger && isInteger(k)) {
        round(value);
    }
    return;
};

export default choose;