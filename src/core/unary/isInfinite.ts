/**
 * Checks if the number is either positive or negative infinity.
 * 
 * @see https://en.wikipedia.org/wiki/Infinity
 * 
 * @param value The number to check, represented as a {@link BaseMegota}.
 * @returns `true` if the number is infinite, otherwise `false`.
 */
function isInfinite(value: BaseMegota): boolean {
    return value.array[0][2] === Infinity;
};

export default isInfinite;