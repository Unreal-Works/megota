import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";
import isNegativeInfinity from "../unary/isNegativeInfinity";
import isPositiveInfinity from "../unary/isPositiveInfinity";


/**
 * Compares this number to another number.
 * Returns:
 * - `1` if this number is greater than the other,
 * - `-1` if this number is less than the other,
 * - `0` if they are equal,
 * - `NaN` if either number is NaN.
 * 
 * @param value The number represented as a {@link BaseMegota} to compare.
 * @param other The other number represented as a {@link BaseMegota} to compare against.
 * @param abs If `true`, compares absolute values instead of signed values.
 * @return `1`, `-1`, `0`, or `NaN` based on the comparison.
 */
function compare(value: BaseMegota, other: BaseMegota, abs?: boolean): 1 | -1 | 0 | typeof NaN {
    // Early returns for special cases
    if (isNaN(value) || isNaN(other)) {
        return NaN;
    }

    if (value === other) {
        return 0;
    }

    // Handle infinity cases quickly
    if (isInfinite(value) || isInfinite(other)) {
        if (isPositiveInfinity(value) && isNegativeInfinity(other)) {
            return 1;
        }
        if (isNegativeInfinity(value) && isPositiveInfinity(other)) {
            return -1;
        }
        if (isInfinite(value) && isInfinite(other)) {
            return value.sign === other.sign ? 0 : value.sign;
        }
        return isInfinite(value) ? value.sign : -other.sign;
    }

    // Handle zero case - both numbers are exactly zero
    if (value.array.length === 1 && value.array[0][2] === 0 &&
        other.array.length === 1 && other.array[0][2] === 0) {
        return 0;
    }

    // If signs differ, the positive number is always greater
    if (value.sign !== other.sign) {
        return value.sign as 1 | -1;
    }

    // For same signs, we need to compare magnitudes
    // If sign is negative, we need to invert the comparison result at the end
    const m = abs === true ? 1 : value.sign;

    // Compare layers - higher layer means larger magnitude
    if (value.layer !== other.layer) {
        return (value.layer > other.layer ? 1 : -1) * m as 1 | -1;
    }

    // Compare array elements from most significant to least significant
    // We iterate from the end (highest magnitude) to the beginning
    const thisLen = value.array.length;
    const otherLen = other.array.length;
    const minLength = Math.min(thisLen, otherLen);

    for (let i = 0; i < minLength; i++) {
        const thisElem = value.array[thisLen - 1 - i];
        const otherElem = other.array[otherLen - 1 - i];

        // Compare layer
        if (thisElem[0] !== otherElem[0]) {
            return (thisElem[0] > otherElem[0] ? 1 : -1) * m as 1 | -1;
        }

        // Compare operation type
        if (thisElem[1] !== otherElem[1]) {
            return (thisElem[1] > otherElem[1] ? 1 : -1) * m as 1 | -1;
        }

        // Compare coefficient
        if (thisElem[2] !== otherElem[2]) {
            return (thisElem[2] > otherElem[2] ? 1 : -1) * m as 1 | -1;
        }
    }

    // If we've compared all elements and they match so far, check array lengths
    if (thisLen !== otherLen) {
        // The number with the longer array is only greater if it has a significant term
        // Skip value check if all arrays have been the same so far
        const longerArray = thisLen > otherLen ? value.array : other.array;
        const extraElem = longerArray[Math.abs(thisLen - otherLen) - 1];

        if (extraElem[0] >= 1 || extraElem[1] > 10) {
            // The extra element is significant
            return (thisLen > otherLen ? 1 : -1) * m as 1 | -1;
        } else {
            // The extra element is not significant
            return (thisLen < otherLen ? 1 : -1) * m as 1 | -1;
        }
    }

    // Arrays are identical
    return 0;
};

export default compare;