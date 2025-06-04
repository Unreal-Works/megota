import compare from "./compare";


/**
 * Checks if this number is equal to another number.
 * 
 * Equivalent to `compare(value, other) === 0`.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @param abs If `true`, compares absolute values instead of signed values.
 * @returns `true` if this number is equal to the other, otherwise `false`.
 */
function equals(value: BaseMegota, other: BaseMegota, abs?: boolean): boolean {
    return compare(value, other, abs) === 0;
};

export default equals;