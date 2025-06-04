import compare from "../compare";
import equals_tolerance from "./equals_tolerance";

/**
 * Compares this number to another number within a specified tolerance.
 * 
 * This method allows for a small margin of error when comparing two numbers, which is useful for
 * floating-point arithmetic where precision can be an issue.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
 * @returns `0` if the numbers are equal within the specified tolerance, `1` if this number is greater, `-1` if less.
 */
function compare_tolerance(value: BaseMegota, other: BaseMegota, tolerance = 1e-7): number {
    return equals_tolerance(value, other, tolerance) ? 0 : compare(value, other);
};

export default compare_tolerance;