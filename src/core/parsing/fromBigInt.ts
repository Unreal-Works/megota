import { PrimitiveConstants } from "../constants";
import normalize from "../normalize";

/**
 * Calculates the base-10 logarithm of a positive BigInt number.
 * 
 * This algorithm uses a binary search approach to find the approximate log10 value
 * for numbers that are too large for JavaScript's native number type.
 * 
 * @param inputBigInt The positive BigInt number to calculate the logarithm for.
 * @returns The base-10 logarithm of the input BigInt as a number.
 */
function log10PosBigInt(inputBigInt: bigint): number {
    // Start with a reasonable bit size for the exponent
    let exponentBits = BigInt(64);

    // First, find an upper bound on the number of bits needed
    // Double the exponent until it's large enough
    while (inputBigInt >= BigInt(1) << exponentBits)
        exponentBits *= BigInt(2);

    // Binary search to find the exact bit length
    let stepSize = exponentBits / BigInt(2);
    while (stepSize > BigInt(0)) {
        // If input is still larger, increase the exponent
        if (inputBigInt >= BigInt(1) << exponentBits) exponentBits += stepSize;
        // Otherwise, decrease the exponent
        else exponentBits -= stepSize;
        // Reduce step size for next iteration (binary search)
        stepSize /= BigInt(2);
    }

    // Extract the most significant bits for precision
    const bitsToRemove = exponentBits - BigInt(54); // 54 bits gives double precision
    const significantBits = inputBigInt >> bitsToRemove;

    // Compute log10 using the significant bits and bit count
    // log10(x) = log10(significantBits) + log10(2^bitsToRemove)
    //          = log10(significantBits) + bitsToRemove * log10(2)
    return Math.log10(Number(significantBits)) + Math.LOG10E / Math.LOG2E * Number(bitsToRemove);
}

/**
 * Creates a MegotaNumber from a BigInt.
 * 
 * @param inputValue The BigInt to convert into a MegotaNumber.
 * @returns A MegotaNumber instance representing the input BigInt.
 */
export default (inputValue: bigint): BaseMegota => {
    // Calculate absolute value of the input
    const absoluteValue = inputValue < BigInt(0) ? -inputValue : inputValue;
    // Set sign based on input value
    const sign = inputValue < BigInt(0) ? -1 : 1;
    let array: Array<Array<number>>;

    // Handle small numbers directly
    if (absoluteValue <= BigInt(PrimitiveConstants.MAX_SAFE_INTEGER)) {
        // For small numbers, just store the value directly
        array = [[0, 0, Number(absoluteValue)]];
    }
    else {
        // For large numbers, convert to scientific notation format:
        // Compute logarithm and store as [0, log10(value)], [1, 1]
        // This represents value = 10^(log10(value))
        array = [[0, 0, log10PosBigInt(absoluteValue)], [0, 1, 1]];
    }
    return normalize({
        array,
        sign,
        layer: 0
    });
};