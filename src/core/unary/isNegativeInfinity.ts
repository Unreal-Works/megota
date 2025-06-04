import isInfinite from "./isInfinite";

/**
 * Checks if the number is negative infinity.
 * 
 * @see {@link Number.NEGATIVE_INFINITY}
 * 
 * @param value The number to check, represented as a {@link BaseMegota}.
 * @returns `true` if the number is negative infinity, otherwise `false`.
 */
function isNegativeInfinity(value: BaseMegota): boolean {
    return isInfinite(value) && value.sign === -1;
};

export default isNegativeInfinity;