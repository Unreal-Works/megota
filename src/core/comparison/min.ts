import isNaN from "../unary/isNaN";
import lessThan from "./lessThan";

/**
 * Returns the minimum of this number and another number.
 * 
 * @param value The current number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @returns The smaller of the two numbers.
 */
function min(value: BaseMegota, other: BaseMegota): BaseMegota {
    if (isNaN(value))
        return value;

    return lessThan(value, other) ? value : other;
};

export default min;