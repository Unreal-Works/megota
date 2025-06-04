/**
 * Checks if the number is finite (not NaN or Infinity).
 * 
 * @param value The number represented as a {@link BaseMegota} to check.
 * @returns `true` if the number is finite, otherwise `false`.
 */
function isFinite(value: BaseMegota): boolean {
    return Number.isFinite(value.array[0][2]);
};

export default isFinite;