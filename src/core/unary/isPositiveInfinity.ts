import isInfinite from "./isInfinite";

/**
 * Checks if the number is positive infinity.
 * 
 * @see {@link Number.POSITIVE_INFINITY}
 * 
 * @param value The number to check, represented as a {@link BaseMegota}.
 * @returns `true` if the number is positive infinity, otherwise `false`.
 */
function isPositiveInfinity(value: BaseMegota): boolean {
    return isInfinite(value) && value.sign === 1;
};

export default isPositiveInfinity;