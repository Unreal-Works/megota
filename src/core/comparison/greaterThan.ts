import compare from "./compare";

/**
 * Checks if this number is greater than another number.
 * 
 * Equivalent to `compare(value, other) > 0`.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @param abs If `true`, compares absolute values instead of signed values.
 * @return `true` if this number is greater than the other, otherwise `false`.
 */
function greaterThan(value: BaseMegota, other: BaseMegota, abs?: boolean): boolean {
    return compare(value, other, abs) > 0;
};

export default greaterThan;