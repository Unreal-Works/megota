import compare from "./compare";

/**
 * Checks if this number is less than or equal to another number.
 * 
 * Equivalent to `compare(value, other) <= 0`.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @param abs If `true`, compares absolute values instead of signed values.
 * @return `true` if this number is less than or equal to the other, otherwise `false`.
 */
function lessThanOrEquals(value: BaseMegota, other: BaseMegota, abs?: boolean): boolean {
    return compare(value, other, abs) <= 0;
};

export default lessThanOrEquals;