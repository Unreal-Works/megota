import isNaN from "../unary/isNaN";
import greaterThan from "./greaterThan";


/**
 * Returns the maximum of this number and another number.
 * 
 * @param value The current number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @returns The larger of the two numbers.
 */
function max(value: BaseMegota, other: BaseMegota): BaseMegota {
    if (isNaN(value))
        return value;

    return greaterThan(value, other) ? value : other;
};

export default max;