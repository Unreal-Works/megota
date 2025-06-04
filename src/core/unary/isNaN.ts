/**
 * Checks if the number is NaN (Not a Number).
 * 
 * @param value The number to check, represented as a {@link BaseMegota}.
 * @returns `true` if the number is NaN, otherwise `false`.
 */
function isNaN(value: BaseMegota): boolean {
    return Number.isNaN(value.array[0][2]);
}

export default isNaN;