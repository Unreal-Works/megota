import { f_gamma, factorials } from "./Gamma";
import { f_lambertw, LambertWError, OMEGA } from "./Lambertw";

export class PrimitiveConstants {
    public static readonly MAX_SAFE_INTEGER = 9007199254740991; // 2^53 - 1
    public static readonly MIN_SAFE_INTEGER = -9007199254740991; // -(2^53 - 1)
    public static readonly MAX_E = Math.log10(this.MAX_SAFE_INTEGER);
    public static readonly E_MAX_SAFE_INTEGER = "e" + this.MAX_SAFE_INTEGER;
    public static readonly EE_MAX_SAFE_INTEGER = "ee" + this.MAX_SAFE_INTEGER;
    public static readonly TETRATED_MAX_SAFE_INTEGER = "10^^" + this.MAX_SAFE_INTEGER;
    public static readonly PENTATED_MAX_SAFE_INTEGER = "10^^^" + this.MAX_SAFE_INTEGER;
    public static readonly GRAHAMS_NUMBER = "J^63 10^^^(10^)^7625597484984 3638334640023.7783";
    public static readonly GENERAL = "N10";
}

/**
 * A number that represents extremely large values, able to handle operations beyond standard JavaScript number limits.
 * 
 * @example
 * const num = MegotaNumber.fromString("10^^3"); // Represents 10 tetrated to 3
 * const num2 = MegotaNumber.fromNumber(5); // Represents the number 5
 * num.moreThan(num2); // true
 */
export default class MegotaNumber {

    /**
     * The maximum number of operators stored in array.
     * If the number of operations exceed the limit, then the least significant operations will be discarded.
     * This is to prevent long loops and eating away of memory and processing time.
     * 100 means there are at maximum of 100 elements in array.
     * It is not recommended to make this number too big.
     * 
     * @example
     * MegotaNumber.maxOps = 100;
     */
    public static maxOps = 15;

    /**
     * Specify what format is used when serializing for JSON.stringify.
     * 0 means the default format, which is a JSON object.
     * 1 means to serialize as a string.
     */
    public static serializeMode = 0;

    /**
     * The prefix used for internal error messages.
     */
    public static readonly errorPrefix = "[MegotaNumError] ";

    /**
     * Regular expression to identify MegotaNumbers.
     */
    public static readonly isMegotaNum = /^[-+]*(Infinity|NaN|(N+|N\^\d+ )?(10(\^+|\{(?!0,0)(\d*,)?\d*\})|\(10(\^+|\{(?!0,0)(\d*,)?\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;

    /**
     * The minimum length of a string that's considered "long" when parsing number representations.
     * 
     * This constant is used when handling string representations of extremely large numbers that
     * exceed JavaScript's native number precision limits. When a string number's length exceeds
     * this threshold, specialized handling is applied in methods like `log10LongString`.
     * 
     * For example, when computing the logarithm of a very large number represented as a string,
     * we take the first 17 digits to compute an accurate base value, then add the remaining
     * length to maintain precision:
     * 
     * log10("12345678901234567890") ≈ log10("12345678901234567") + (20-17)
     */
    public static readonly LONG_STRING_MIN_LENGTH = 17;

    protected static readonly ZERO = this.fromNumber(0);
    protected static readonly ONE = this.fromNumber(1);
    protected static readonly TWO = this.fromNumber(2);
    protected static readonly THREE = this.fromNumber(3);
    protected static readonly FOUR = this.fromNumber(4);
    protected static readonly TEN = this.fromNumber(10);
    protected static readonly E = this.fromNumber(Math.E);
    protected static readonly LN2 = this.fromNumber(Math.LN2);
    protected static readonly LN10 = this.fromNumber(Math.LN10);
    protected static readonly LOG2E = this.fromNumber(Math.LOG2E);
    protected static readonly LOG10E = this.fromNumber(Math.LOG10E);
    protected static readonly PI = this.fromNumber(Math.PI);
    protected static readonly SQRT1_2 = this.fromNumber(Math.SQRT1_2);
    protected static readonly SQRT2 = this.fromNumber(Math.SQRT2);
    protected static readonly MAX_SAFE_INTEGER = this.fromNumber(PrimitiveConstants.MAX_SAFE_INTEGER);
    protected static readonly MIN_SAFE_INTEGER = this.fromNumber(PrimitiveConstants.MIN_SAFE_INTEGER);
    protected static readonly MAX_E = this.fromNumber(PrimitiveConstants.MAX_E);
    protected static readonly NaN = this.fromNumber(Number.NaN);
    protected static readonly NEGATIVE_INFINITY = this.fromNumber(Number.NEGATIVE_INFINITY);
    protected static readonly POSITIVE_INFINITY = this.fromNumber(Number.POSITIVE_INFINITY);
    protected static readonly E_MAX_SAFE_INTEGER = this.fromString(PrimitiveConstants.E_MAX_SAFE_INTEGER);
    protected static readonly EE_MAX_SAFE_INTEGER = this.fromString(PrimitiveConstants.EE_MAX_SAFE_INTEGER);
    protected static readonly TETRATED_MAX_SAFE_INTEGER = this.fromString(PrimitiveConstants.TETRATED_MAX_SAFE_INTEGER);
    protected static readonly PENTATED_MAX_SAFE_INTEGER = this.fromString(PrimitiveConstants.PENTATED_MAX_SAFE_INTEGER);
    protected static readonly GRAHAMS_NUMBER = this.fromString(PrimitiveConstants.GRAHAMS_NUMBER);
    protected static readonly GENERAL = this.fromString(PrimitiveConstants.GENERAL);

    protected static readonly RECIP_MAX = this.fromString("2e323");
    protected static readonly NEGATIVE_E_RECIP = this.fromNumber(-1 / Math.E);
    protected static readonly EXP_E_RECIP = this.fromNumber(Math.exp(1 / Math.E));
    protected static readonly EXP_NEGATIVE_E_RECIP = this.fromNumber(Math.exp(-1 / Math.E));
    protected static readonly NEGATIVE_ONE = this.fromNumber(-1);
    protected static readonly NEGATIVE_TWO = this.fromNumber(-2);

    /**
     * The sign of the number.
     * 
     * Note that 0 is considered positive.
     */
    public sign: 1 | -1 = 1;

    /**
     * Array of triplets in the form `[[a0,b0,c0],[a1,b1,c1],[a2,b2,c2],[a3,b3,c3],...]`, representing the *top* layer of a number in the level of megotion.
     * - `a` is the level; how many times the operation is applied.
     * - `b` is the type; what operation is applied.
     * - `c` is the value; the coefficient of the operation.
     * 
     * The number it represents is `sign × {10,10,10,layer} × array`.
     * 
     * @example
     * 5 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 5 ] ]
     * -1.5e18 = -1 × {10, 10, 10, 0} × [ [ 0, 0, 18.176... ], [ 0, 1, 1 ] ] // (10↑18.176){1}1
     * 4{25}80 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 18.602... ], [ 0, 1, 1 ], [ 0, 24, 79 ] ] // (10↑18.602){25}80
     * 4{{3}}3 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 153.906... ], [ 0, 1, 2 ], [ 0, 2, 2 ], [ 0, 3, 2 ], [ 1, 0, 1 ] ] // (10↑153.906){3}3
     */
    public array: Array<Array<number>> = [[0, 0, 0]];

    /**
     * 
     */
    public layer: number = 0;

    /**
     * Create a new MegotaNumber instance.
     * Defaults to 0.
     */
    public constructor() {

    }



    /**
     * Creates a MegotaNumber from a standard number.
     * 
     * @example
     * MegotaNumber.fromNumber(5); // 1 × {10, 10, 10, 0} × [ 0, 0, 5 ] = 5
     * 
     * @param input 
     * @returns 
     */
    public static fromNumber(input: number) {
        const x = new this();
        x.array[0][2] = Math.abs(input);
        x.sign = input < 0 ? -1 : 1;
        x.normalize();
        return x;
    }

    /**
     * Calculates the base-10 logarithm of extremely large numbers represented as strings.
     * 
     * This method provides a way to compute accurate logarithms for numbers that exceed JavaScript's
     * native precision limits. It uses a mathematical property that:
     * log10(a * 10^n) = log10(a) + n
     * 
     * The implementation takes the first {@link MegotaNumber.LONG_STRING_MIN_LENGTH} digits of the string,
     * calculates the logarithm of that portion, then adds the remaining length to account for the magnitude.
     * 
     * @example
     * // For "12345678901234567890" (20 digits):
     * // 1. Takes first 17 digits: "12345678901234567"
     * // 2. Calculates Math.log10(12345678901234567) ≈ 16.09
     * // 3. Adds remaining length: 20 - 17 = 3
     * // 4. Result: 16.09 + 3 = 19.09
     * MegotaNumber.log10LongString("12345678901234567890"); // Returns approximately 19.09
     * 
     * @example
     * // For very large numbers like "10^100":
     * // Accurately calculates log10(10^100) = 100
     * 
     * @param str Representation of a very large number
     * @returns The approximate base-10 logarithm of the number
     */
    private static log10LongString(str: string) {
        return Math.log10(Number(str.substring(0, this.LONG_STRING_MIN_LENGTH))) + (str.length - this.LONG_STRING_MIN_LENGTH);
    }

    /**
     * Converts a string representation of a number into a MegotaNumber object.
     * 
     * This method handles multiple notation formats:
     * - Standard decimal notation: "123.456"
     * - Scientific notation: "1.23e45"
     * - Arrow notation: "10^^^^^3" (10 heptated to 3)
     * - Curly bracket notation: "10{a,b}c" 
     * - PsiCubed2's letter notation: "N" or "N^x" (for numbers beyond normal representation)
     * - Special values: "NaN", "Infinity"
     * 
     * The parsing process follows these steps:
     * 1. Check if the input is JSON and handle accordingly
     * 2. Process any sign characters (+ or -)
     * 3. Handle special values (NaN, Infinity)
     * 4. Process layer notation (N prefix)
     * 5. Process arrow/bracket expressions
     * 6. Process scientific notation components
     * 7. Normalize the resulting number
     * 
     * @example
     * // Basic numbers
     * MegotaNumber.fromString("123.456"); // -> 123.456
     * MegotaNumber.fromString("-42"); // -> -42
     * 
     * @example
     * // Scientific notation
     * MegotaNumber.fromString("1.23e45"); // -> 1.23×10^45
     * MegotaNumber.fromString("6.022e23"); // -> 6.022×10^23
     * 
     * @example
     * // Extended notation
     * MegotaNumber.fromString("10^^3"); // -> 10^10^10 (tetration)
     * MegotaNumber.fromString("10{1,0}2"); // -> J2 (extension of hyper-operations)
     * MegotaNumber.fromString("N10"); // -> 10 with layer 1 (beyond standard representation)
     * 
     * @param input String representation of a number to convert
     * @returns A MegotaNumber representing the input string
     */
    public static fromString(input: string) {
        let isJSON = false;
        if (input[0] == "[" || input[0] == "{") {
            try {
                JSON.parse(input);
            } finally {
                isJSON = true;
            }
        }
        if (isJSON) {
            return this.fromJSON(input);
        }

        const x = new this();
        x.array = [[0, 0, 0]];
        const initial = input;
        input = input.replaceAll("J^", "(10{1,0})^");
        input = input.replaceAll("J", "10{1,0}");

        if (!this.isMegotaNum.test(input)) {
            console.warn("Malformed input: " + initial);
            x.array = [[0, 0, NaN]];
            return x;
        }

        let negateIt = false;
        if (input[0] == "-" || input[0] == "+") {
            const numSigns = input.search(/[^-+]/);
            const signs = input.substring(0, numSigns);
            const minusCount = signs.match(/-/g)?.length || 0;
            negateIt = minusCount % 2 === 1;
            input = input.substring(numSigns);
        }

        if (input == "NaN") {
            x.array = [[0, 0, NaN]];
        }
        else if (input == "Infinity") {
            x.array = [[0, 0, Infinity]];
        }
        else {
            let a, b, c, d, i;
            if (input[0] == "N") {
                if (input[1] == "^") {
                    a = input.substring(2).search(/[^0-9]/) + 2;
                    x.layer = Number(input.substring(2, a));
                    input = input.substring(a + 1);
                } else {
                    a = input.search(/[^N]/);
                    x.layer = a;
                    input = input.substring(a);
                }
            }
            while (input) {
                if (/^\(?10[\^{]/.test(input)) {
                    if (input[0] == "(") {
                        input = input.substring(1);
                    }
                    let arrows: Array<number>;
                    if (input[2] == "^") {
                        a = input.substring(2).search(/[^^]/);
                        arrows = [0, a];
                        b = a + 2;
                    } else {
                        a = input.indexOf("}");
                        arrows = input.substring(3, a).split(",").map(e => parseInt(e));
                        if (arrows.length == 1) arrows.unshift(0);
                        b = a + 1;
                    }
                    input = input.substring(b);
                    if (input[0] == ")") {
                        a = input.indexOf(" ");
                        c = Number(input.substring(2, a));
                        input = input.substring(a + 1);
                    } else {
                        c = 1;
                    }
                    if (arrows[0] == 0 && arrows[1] == 1) {
                        if (x.array.length >= 2 && x.array[1][0] == 0 && x.array[1][1] == 1) {
                            x.array[1][2] += c;
                        } else {
                            x.array.splice(1, 0, [0, 1, c]);
                        }
                    } else if (arrows[0] == 0 && arrows[1] == 2) {
                        a = x.array.length >= 2 && (x.array[1][0] == 0 && x.array[1][1] == 1) ? x.array[1][2] : 0;
                        b = x.array[0][2];
                        if (b >= 1e10) ++a;
                        if (b >= 10) ++a;
                        x.array[0][2] = a;
                        if (x.array.length >= 2 && x.array[1][0] == 0 && x.array[1][1] == 1) x.array.splice(1, 1);
                        d = x.getOperatorIndex([0, 2]);
                        if (Number.isInteger(d)) x.array[d][2] += c;
                        else x.array.splice(Math.ceil(d), 0, [0, 2, c]);
                    } else {
                        a = x.operator([arrows[0], arrows[1] - 1]);
                        b = x.operator([arrows[0], arrows[1] - 2]);
                        if (b >= 10) ++a;
                        d = x.getOperatorIndex(arrows as [number, number]);
                        x.array.splice(1, Math.ceil(d) - 1);
                        x.array[0][2] = a;
                        if (Number.isInteger(d)) x.array[1][2] += c;
                        else x.array.splice(1, 0, [...arrows, c]);
                    }
                } else {
                    break;
                }
            }
            a = input.split(/[Ee]/);
            b = [x.array[0][2], 0];
            c = 1;
            for (i = a.length - 1; i >= 0; --i) {
                //The things that are already there
                if (b[0] < PrimitiveConstants.MAX_E && b[1] === 0) {
                    b[0] = Math.pow(10, c * b[0]);
                } else if (c == -1) {
                    if (b[1] === 0) {
                        b[0] = Math.pow(10, c * b[0]);
                    } else if (b[1] == 1 && b[0] <= Math.log10(Number.MAX_VALUE)) {
                        b[0] = Math.pow(10, c * Math.pow(10, b[0]));
                    } else {
                        b[0] = 0;
                    }
                    b[1] = 0;
                } else {
                    b[1]++;
                }
                //Multiplying coefficient
                const decimalPointPos = a[i].indexOf(".");
                const intPartLen = decimalPointPos == -1 ? a[i].length : decimalPointPos;
                if (b[1] === 0) {
                    if (intPartLen >= this.LONG_STRING_MIN_LENGTH) {
                        b[0] = Math.log10(b[0]) + this.log10LongString(a[i].substring(0, intPartLen));
                        b[1] = 1;
                    }
                    else if (a[i]) {
                        b[0] *= Number(a[i]);
                    }
                } else {
                    d = intPartLen >= this.LONG_STRING_MIN_LENGTH ? this.log10LongString(a[i].substring(0, intPartLen)) : a[i] ? Math.log10(Number(a[i])) : 0;
                    if (b[1] == 1) {
                        b[0] += d;
                    } else if (b[1] == 2 && b[0] < PrimitiveConstants.MAX_E + Math.log10(d)) {
                        b[0] += Math.log10(1 + Math.pow(10, Math.log10(d) - b[0]));
                    }
                }
                //Carrying
                if (b[0] < PrimitiveConstants.MAX_E && b[1]) {
                    b[0] = Math.pow(10, b[0]);
                    b[1]--;
                } else if (b[0] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                    b[0] = Math.log10(b[0]);
                    b[1]++;
                }
            }
            x.array[0][2] = b[0];
            if (b[1]) {
                if (x.array.length >= 2 && x.array[1][0] == 0 && x.array[1][1] == 1) x.array[1][2] += b[1];
                else x.array.splice(1, 0, [0, 1, b[1]]);
            }
        }

        if (negateIt) {
            x.sign *= -1;
        }

        x.normalize();
        return x;
    }

    /**
     * Creates a MegotaNumber from a JSON string.
     * 
     * @param input The JSON string to parse into a MegotaNumber.
     * @returns A MegotaNumber instance representing the parsed JSON.
     */
    public static fromJSON(input: string) {
        return this.fromObject(JSON.parse(input));
    }

    /**
     * Attempts to parse an object into a MegotaNumber.
     * 
     * @param input The input object to parse into a MegotaNumber.
     * @returns A MegotaNumber instance representing the input object.
     */
    public static fromObject(input: unknown): MegotaNumber {
        if (typeof input != "object")
            throw new TypeError("Expected object, got " + typeof input + ".");

        if (input === null)
            return this.ZERO.clone();

        if (input instanceof Array)
            return this.fromOmegaNum(input);

        if (input instanceof this)
            return input.normalize();

        if (!("array" in input) || !("sign" in input) || !("layer" in input))
            throw new TypeError("Expected object with properties 'array', 'sign', and 'layer'.");

        if (!(input.array instanceof Array))
            throw new TypeError("Expected property 'array' to be an Array, got " + typeof input.array + ".");

        if (typeof input.sign != "number")
            throw new TypeError("Expected property 'sign' to be a Number, got " + typeof input.sign + ".");

        if (typeof input.layer != "number")
            throw new TypeError("Expected property 'layer' to be a Number, got " + typeof input.layer + ".");

        const parsed = new MegotaNumber();
        parsed.array = input.array ?? [[0, 0, 0]];
        parsed.sign = input.sign !== undefined ? (input.sign < 0 ? -1 : 1) : 1;
        parsed.layer = input.layer !== undefined ? input.layer : 0;
        return parsed;
    }

    /**
     * Calculates the base-10 logarithm of a positive BigInt number.
     * 
     * This algorithm uses a binary search approach to find the approximate log10 value
     * for numbers that are too large for JavaScript's native number type.
     * 
     * @param inputBigInt The positive BigInt number to calculate the logarithm for.
     * @returns The base-10 logarithm of the input BigInt as a number.
     */
    private static log10PosBigInt(inputBigInt: bigint): number {
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
    public static fromBigInt(inputValue: bigint): MegotaNumber {
        const resultNumber = new MegotaNumber();
        // Calculate absolute value of the input
        const absoluteValue = inputValue < BigInt(0) ? -inputValue : inputValue;
        // Set sign based on input value
        resultNumber.sign = inputValue < BigInt(0) ? -1 : 1;

        // Handle small numbers directly
        if (absoluteValue <= BigInt(PrimitiveConstants.MAX_SAFE_INTEGER)) {
            // For small numbers, just store the value directly
            resultNumber.array[0][2] = Number(absoluteValue);
        }
        else {
            // For large numbers, convert to scientific notation format:
            // Compute logarithm and store as [0, log10(value)], [1, 1]
            // This represents value = 10^(log10(value))
            resultNumber.array = [[0, 0, this.log10PosBigInt(absoluteValue)], [0, 1, 1]];
        }
        return resultNumber.normalize();
    }

    /**
     * Creates a MegotaNumber from an array of numbers in OmegaNum.js format.
     * 
     * OmegaNum.js represents large numbers as an array where each entry is a coefficient
     * for a specific operation level. This method maps those entries to MegotaNumber's
     * internal representation.
     * 
     * @see https://github.com/Naruyoko/OmegaNum.js
     * 
     * @param omegaArray The OmegaNum.js array to convert into a MegotaNumber.
     * @returns A MegotaNumber instance representing the input array.
     */
    public static fromOmegaNum(omegaArray: Array<number>): MegotaNumber {
        const resultNumber = new MegotaNumber();

        // In OmegaNum format, each position represents a different operation level
        for (let operationLevel = 0; operationLevel < omegaArray.length; operationLevel++) {
            // Create a triplet [layer, operator, value] for each entry
            // OmegaNum uses fixed layer 0 with varying operation levels
            resultNumber.array.push([0, operationLevel, omegaArray[operationLevel]]);
        }

        return resultNumber.normalize();
    }

    /**
     * Creates a MegotaNumber from an array of arrays in ExpantaNum.js format.
     * 
     * ExpantaNum.js represents large numbers as an array of [operation, value] pairs.
     * This method maps those pairs to MegotaNumber's internal representation.
     * 
     * @see https://github.com/Naruyoko/ExpantaNum.js
     * 
     * @param expantaArray The ExpantaNum.js array to convert into a MegotaNumber.
     * @returns A MegotaNumber instance representing the input array.
     */
    public static fromExpantaNum(expantaArray: Array<Array<number>>): MegotaNumber {
        const resultNumber = new MegotaNumber();

        // Process each entry in the ExpantaNum array
        for (let index = 0; index < expantaArray.length; index++) {
            // ExpantaNum uses format [operation, value]
            // Map to MegotaNumber's [layer, operation, value] format with fixed layer 0
            const operation = expantaArray[index][0];
            const value = expantaArray[index][1];
            resultNumber.array.push([0, operation, value]);
        }

        return resultNumber.normalize();
    }

    /**
     * Creates a deep clone of the current MegotaNumber instance.
     * 
     * This method creates a new MegotaNumber object with the same properties as the original,
     * ensuring that all nested objects are also copied (deep copy) rather than referenced.
     * This prevents unintended modifications to the original object when the clone is modified.
     * 
     * @returns A new MegotaNumber instance that is a complete independent copy of the current instance.
     */
    public clone(): MegotaNumber {
        // Create a new empty MegotaNumber instance
        const clonedNumber = new MegotaNumber();

        // Create a deep copy of the array representation
        const clonedArray = [];
        for (let index = 0; index < this.array.length; ++index) {
            // Use spread operator to create a new array for each triplet
            // This ensures we have a true deep copy of each [layer, operation, value] triplet
            clonedArray.push([...this.array[index]]);
        }

        // Copy all properties to the new instance
        clonedNumber.array = clonedArray;
        clonedNumber.sign = this.sign;
        clonedNumber.layer = this.layer;

        return clonedNumber;
    }

    /**
     * Returns the absolute value of the number (the value without regard to whether it is positive or negative).
     * 
     * @returns The absolute value of the number.
     */
    public abs(): MegotaNumber {
        const x = this.clone();
        x.sign = 1;
        return x;
    }

    /**
     * Returns the negated value of the number (the value with the opposite sign).
     * 
     * @returns The negated value of the number.
     */
    public negate(): MegotaNumber {
        const x = this.clone();
        x.sign *= -1;
        return x;
    }

    /**
     * Checks if the number is NaN (Not a Number).
     * 
     * @returns `true` if the number is NaN, otherwise `false`.
     */
    public isNaN(): boolean {
        return isNaN(this.array[0][2]);
    }

    /**
     * Checks if the number is an integer.
     * 
     * Note that all numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER} are considered integers.
     * 
     * @returns `true` if the number is an integer, otherwise `false`.
     */
    public isInteger(): boolean {
        if (this.sign == -1)
            return this.abs().isInteger();
        if (this.greaterThan(MegotaNumber.MAX_SAFE_INTEGER))
            return true;
        return Number.isInteger(this.toNumber());
    }

    /**
     * Checks if the number is finite (not NaN or Infinity).
     * 
     * @returns `true` if the number is finite, otherwise `false`.
     */
    public isFinite(): boolean {
        return isFinite(this.array[0][2]);
    }

    /**
     * Checks if the number is positive infinity.
     * 
     * @see {@link Number.POSITIVE_INFINITY}
     * 
     * @returns `true` if the number is positive infinity, otherwise `false`.
     */
    public isPositiveInfinity(): boolean {
        return this.isInfinite() && this.sign === 1;
    }

    /**
     * Checks if the number is negative infinity.
     * 
     * @see {@link Number.NEGATIVE_INFINITY}
     * 
     * @returns `true` if the number is negative infinity, otherwise `false`.
     */
    public isNegativeInfinity(): boolean {
        return this.isInfinite() && this.sign === -1;
    }

    /**
     * Checks if the number is either positive or negative infinity.
     * 
     * @see https://en.wikipedia.org/wiki/Infinity
     * 
     * @returns `true` if the number is infinite, otherwise `false`.
     */
    public isInfinite(): boolean {
        return this.array[0][2] === Infinity;
    }

    /**
     * Compares this MegotaNumber to another MegotaNumber.
     * Returns:
     * - `1` if this number is greater than the other,
     * - `-1` if this number is less than the other,
     * - `0` if they are equal,
     * - `NaN` if either number is NaN.
     * 
     * @param other The other MegotaNumber to compare against.
     * @return `1`, `-1`, `0`, or `NaN` based on the comparison.
     */
    public compareTo(other: MegotaNumber): 1 | -1 | 0 | typeof NaN {
        if (this.isNaN() || other.isNaN()) {
            return NaN;
        }

        if (this.isPositiveInfinity() && other.isNegativeInfinity()) {
            return this.sign;
        }

        if (other.isPositiveInfinity() && this.isNegativeInfinity()) {
            return -this.sign;
        }

        if (this.array.length == 1 && this.array[0][2] === 0 && other.array.length == 1 && other.array[0][2] === 0)
            return 0;

        if (this.sign != other.sign)
            return this.sign;

        const m = this.sign;
        let r: number | undefined = undefined;
        if (this.layer > other.layer) {
            r = 1;
        }
        else if (this.layer < other.layer) {
            r = -1;
        }
        else {
            let e: Array<number>;
            let f: Array<number>;
            const l = 0;
            for (let i = 0, l = Math.min(this.array.length, other.array.length); i < l; ++i) {
                e = this.array[this.array.length - 1 - i];
                f = other.array[other.array.length - 1 - i];
                if (e[0] > f[0] || e[0] == f[0] && e[1] > f[1] || e[1] == f[1] && e[2] > f[2]) {
                    r = 1;
                    break;
                } else if (e[0] < f[0] || e[0] == f[0] && e[1] < f[1] || e[1] == f[1] && e[2] < f[2]) {
                    r = -1;
                    break;
                }
            }
            if (r === undefined) {
                if (this.array.length == other.array.length) {
                    r = 0;
                } else if (this.array.length > other.array.length) {
                    e = this.array[this.array.length - l];
                    if (e[0] >= 1 || e[1] > 10) {
                        r = 1;
                    } else {
                        r = -1;
                    }
                } else {
                    e = other.array[other.array.length - l];
                    if (e[0] >= 1 || e[1] > 10) {
                        r = -1;
                    } else {
                        r = 1;
                    }
                }
            }
        }
        return r * m;
    }

    /**
     * Checks if this MegotaNumber is greater than another MegotaNumber.
     * 
     * Equivalent to `this.compareTo(other) > 0`.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns `true` if this number is greater than the other, otherwise `false`.
     */
    public greaterThan(other: MegotaNumber): boolean {
        return this.compareTo(other) > 0;
    }

    /**
     * Checks if this MegotaNumber is less than another MegotaNumber.
     * 
     * Equivalent to `this.compareTo(other) < 0`.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns `true` if this number is less than the other, otherwise `false`.
     */
    public lessThan(other: MegotaNumber): boolean {
        return this.compareTo(other) < 0;
    }

    /**
     * Checks if this MegotaNumber is equal to another MegotaNumber.
     * 
     * Equivalent to `this.compareTo(other) === 0`.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns `true` if this number is equal to the other, otherwise `false`.
     */
    public equals(other: MegotaNumber): boolean {
        return this.compareTo(other) === 0;
    }

    /**
     * Checks if this MegotaNumber is greater than or equal to another MegotaNumber.
     * 
     * Equivalent to `this.compareTo(other) >= 0`.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns `true` if this number is greater than or equal to the other, otherwise `false`.
     */
    public greaterThanOrEquals(other: MegotaNumber): boolean {
        return this.compareTo(other) >= 0;
    }

    /**
     * Checks if this MegotaNumber is less than or equal to another MegotaNumber.
     * 
     * Equivalent to `this.compareTo(other) <= 0`.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns `true` if this number is less than or equal to the other, otherwise `false`.
     */
    public lessThanOrEquals(other: MegotaNumber): boolean {
        return this.compareTo(other) <= 0;
    }

    /**
     * Checks if this MegotaNumber is equal to another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `true` if the numbers are considered equal within the specified tolerance, otherwise `false`.
     */
    public equals_tolerance(other: MegotaNumber, tolerance = 1e-7): boolean {
        if (this.isNaN() || other.isNaN() || this.isFinite() != other.isFinite())
            return false;

        if (this.sign != other.sign)
            return false;

        if (Math.abs(this.layer - other.layer) > 1)
            return false;

        let a: number | undefined;
        let b: number | undefined;

        if (this.layer != other.layer) {
            const higherLayerNumber = this.layer > other.layer ? this : other;
            const lowerLayerNumber = this.layer > other.layer ? other : this;

            if (!(higherLayerNumber.array.length == 2 &&
                higherLayerNumber.array[0][0] === 0 &&
                higherLayerNumber.array[0][1] === 0 &&
                higherLayerNumber.array[1][0] === 0 &&
                higherLayerNumber.array[1][1] == 1 &&
                higherLayerNumber.array[1][2] == 1))
                return false;

            a = higherLayerNumber.array[0][2];

            const lastElem = lowerLayerNumber.array[lowerLayerNumber.array.length - 1];
            if (lastElem[1] >= 10) {
                b = Math.log10(lastElem[1] + 1);
            } else {
                b = Math.log10(lastElem[1]);
            }
        } else {
            const maxLength = Math.max(this.array.length, other.array.length);

            if (Math.abs(this.array[this.array.length - 1][1] - other.array[other.array.length - 1][1]) > 1)
                return false;

            for (let i = 1; maxLength - i >= 0; ++i) {
                const thisIdx = this.array.length - i;
                const otherIdx = other.array.length - i;

                // Skip if index is out of bounds for either array
                if (thisIdx < 0 || otherIdx < 0) continue;

                const thisValue = this.array[thisIdx][1];
                const otherValue = other.array[otherIdx][1];

                if (thisValue != otherValue) {
                    // Different values case
                    const largerValueNum = thisValue > otherValue ? this : other;
                    const smallerValueNum = thisValue > otherValue ? other : this;
                    const largerValue = thisValue > otherValue ? thisValue : otherValue;
                    const largerIdx = largerValueNum.array.length - i;

                    const e = largerValueNum.array[largerIdx][2];
                    const f = 0;

                    if (Math.abs(e - f) > 1) {
                        return false;
                    }

                    if (!(largerIdx < 2 ||
                        (largerIdx == 2 &&
                            largerValueNum.array[0][0] === 0 &&
                            largerValueNum.array[0][1] === 0 &&
                            largerValueNum.array[1][0] === 0 &&
                            largerValueNum.array[1][1] == 1 &&
                            largerValueNum.array[1][2] == 1))) {
                        return false;
                    }

                    a = largerValueNum.array[0][2];

                    if (largerValue == 1) {
                        b = Math.log10(smallerValueNum.operator([0, 0]));
                    } else if (largerValue == 2 && smallerValueNum.operator([0, 0]) >= 1e10) {
                        b = Math.log10(smallerValueNum.operator([0, 1]) + 2);
                    } else if (smallerValueNum.operator([0, largerValue - 2]) >= 10) {
                        b = Math.log10(smallerValueNum.operator([0, largerValue - 1]) + 1);
                    } else {
                        b = Math.log10(smallerValueNum.operator([0, largerValue - 1]));
                    }
                    break;
                } else {
                    // Same values case
                    const e = this.array[thisIdx][2];
                    const f = other.array[otherIdx][2];

                    if (thisIdx == 0) {
                        a = e;
                        b = f;
                        break;
                    }

                    if (Math.abs(e - f) > 1) {
                        return false;
                    }

                    if (e !== f) {
                        const higherValueNum = e > f ? this : other;
                        const lowerValueNum = e > f ? other : this;
                        const higherIdx = higherValueNum.array.length - i;
                        const c = thisValue; // or otherValue, they're the same

                        if (!(higherIdx < 2 ||
                            (higherIdx == 2 &&
                                higherValueNum.array[0][0] === 0 &&
                                higherValueNum.array[0][1] === 0 &&
                                higherValueNum.array[1][0] === 0 &&
                                higherValueNum.array[1][1] == 1 &&
                                higherValueNum.array[1][2] == 1))) {
                            return false;
                        }

                        a = higherValueNum.array[0][2];

                        if (c == 1) {
                            b = Math.log10(lowerValueNum.operator([0, 0]));
                        } else if (c == 2 && lowerValueNum.operator([0, 0]) >= 1e10) {
                            b = Math.log10(lowerValueNum.operator([0, 1]) + 2);
                        } else if (lowerValueNum.operator([0, c - 2]) >= 10) {
                            b = Math.log10(lowerValueNum.operator([0, c - 1]) + 1);
                        } else {
                            b = Math.log10(lowerValueNum.operator([0, c - 1]));
                        }
                        break;
                    }
                }
            }
        }

        if (a === undefined || b === undefined) {
            return false;
        }

        return Math.abs(a - b) <= tolerance * Math.max(Math.abs(a), Math.abs(b));
    }

    /**
     * Compares this MegotaNumber to another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `0` if the numbers are equal within the specified tolerance, `1` if this number is greater, `-1` if less.
     */
    public compareTo_tolerance(other: MegotaNumber, tolerance = 1e-7): number {
        return this.equals_tolerance(other, tolerance) ? 0 : this.compareTo(other);
    }

    /**
     * Checks if this MegotaNumber is greater than another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `true` if this number is greater than the other within the specified tolerance, otherwise `false`.
     */
    public greaterThan_tolerance(other: MegotaNumber, tolerance = 1e-7): boolean {
        return this.compareTo_tolerance(other, tolerance) > 0;
    }

    /**
     * Checks if this MegotaNumber is less than another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `true` if this number is less than the other within the specified tolerance, otherwise `false`.
     */
    public lessThan_tolerance(other: MegotaNumber, tolerance = 1e-7): boolean {
        return this.compareTo_tolerance(other, tolerance) < 0;
    }

    /**
     * Checks if this MegotaNumber is greater than or equal to another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `true` if this number is greater than or equal to the other within the specified tolerance, otherwise `false`.
     */
    public greaterThanOrEquals_tolerance(other: MegotaNumber, tolerance = 1e-7): boolean {
        return this.compareTo_tolerance(other, tolerance) >= 0;
    }

    /**
     * Checks if this MegotaNumber is less than or equal to another MegotaNumber within a specified tolerance.
     * 
     * This method allows for a small margin of error when comparing two numbers, which is useful for
     * floating-point arithmetic where precision can be an issue.
     * 
     * @param other The other MegotaNumber to compare against.
     * @param tolerance The acceptable margin of error for the comparison (default is 1e-7).
     * @returns `true` if this number is less than or equal to the other within the specified tolerance, otherwise `false`.
     */
    public lessThanOrEquals_tolerance(other: MegotaNumber, tolerance = 1e-7): boolean {
        return this.compareTo_tolerance(other, tolerance) <= 0;
    }

    /**
     * Returns the minimum of this MegotaNumber and another MegotaNumber.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns The smaller of the two MegotaNumbers.
     */
    public min(other: MegotaNumber): MegotaNumber {
        return this.lessThan(other) ? this.clone() : other.clone();
    }

    /**
     * Returns the maximum of this MegotaNumber and another MegotaNumber.
     * 
     * @param other The other MegotaNumber to compare against.
     * @returns The larger of the two MegotaNumbers.
     */
    public max(other: MegotaNumber): MegotaNumber {
        return this.greaterThan(other) ? this.clone() : other.clone();
    }

    /**
     * Normalizes the MegotaNumber instance.
     * This method ensures that the internal representation of the number is consistent and adheres to the defined rules.
     * It sorts the array, removes duplicates, and adjusts the layer and sign as necessary.
     * 
     * @returns The normalized MegotaNumber instance.
     */
    public normalize(): MegotaNumber {
        let b: boolean = true;

        if (!this.array || !this.array.length) {
            this.array = [[0, 0, 0]];
        }

        if (this.sign !== 1 && this.sign !== -1) {
            const sign = typeof this.sign === "number" ? this.sign : Number(this.sign);
            this.sign = sign < 0 ? -1 : 1;
        }

        if (this.layer > PrimitiveConstants.MAX_SAFE_INTEGER) {
            this.array = [[0, 0, Infinity]];
            this.layer = 0;
            return this;
        }
        if (Number.isInteger(this.layer)) {
            this.layer = Math.floor(this.layer);
        }
        for (let i = 0; i < this.array.length; ++i) {
            const e = this.array[i];
            if (e[0] === null || e[0] === undefined) {
                e[0] = 0;
            }

            if ((e[0] !== 0 || e[1] !== 0) && (e[2] === 0 || e[2] === null || e[2] === undefined)) {
                this.array.splice(i, 1);
                --i;
                continue;
            }

            if (isNaN(e[0]) || isNaN(e[1]) || isNaN(e[2])) {
                this.array = [[0, 0, NaN]];
                return this;
            }

            if (!isFinite(e[0]) || !isFinite(e[1]) || !isFinite(e[2])) {
                this.array = [[0, 0, Infinity]];
                return this;
            }

            if (!Number.isInteger(e[0])) {
                e[0] = Math.floor(e[0]);
            }

            if (!Number.isInteger(e[1])) {
                e[1] = Math.floor(e[1]);
            }

            if ((e[0] !== 0 || e[1] !== 0) && !Number.isInteger(e[2])) {
                e[2] = Math.floor(e[2]);
            }
        }

        do {
            b = false;
            this.array.sort((a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0);
            this.array.sort((a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
            if (this.array.length > MegotaNumber.maxOps) {
                this.array.splice(0, this.array.length - MegotaNumber.maxOps);
            }

            if (!this.array.length) {
                this.array = [[0, 0, 0]];
            }

            if (this.array[this.array.length - 1][0] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                this.layer++;
                this.array = [[0, 0, this.array[this.array.length - 1][0]]];
                b = true;
            }
            else if (this.layer && this.array.length == 1 && this.array[0][0] === 0 && this.array[0][1] === 0) {
                this.layer--;
                if (this.array[0][2] === 0) this.array = [[0, 0, 10]];
                else this.array = [[0, 0, 10], [Math.round(this.array[0][2]), 0, 1]];
                b = true;
            }

            if (this.array.length < MegotaNumber.maxOps && (this.array[0][0] !== 0 || this.array[0][1] !== 0)) {
                this.array.unshift([0, 0, 10]);
            }

            for (let i = 0; i < this.array.length - 1; ++i) {
                if (this.array[i][0] == this.array[i + 1][0] && this.array[i][1] == this.array[i + 1][1]) {
                    this.array[i][2] += this.array[i + 1][2];
                    this.array.splice(i + 1, 1);
                    --i;
                    b = true;
                }
            }
            if (this.array[0][0] === 0 && this.array[0][1] === 0 && this.array[0][2] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                if (this.array.length >= 2 && this.array[1][0] == 0 && this.array[1][1] == 1) {
                    this.array[1][2]++;
                } else {
                    this.array.splice(1, 0, [0, 1, 1]);
                }
                this.array[0][2] = Math.log10(this.array[0][2]);
                b = true;
            }
            while (this.array.length >= 2 && this.array[0][0] === 0 && this.array[0][1] === 0 && this.array[0][2] < PrimitiveConstants.MAX_E && this.array[1][0] == 0 && this.array[1][1] == 1 && this.array[1][2]) {
                this.array[0][2] = Math.pow(10, this.array[0][2]);
                if (this.array[1][2] > 1) {
                    this.array[1][2]--;
                } else {
                    this.array.splice(1, 1);
                }
                b = true;
            }
            while (this.array.length >= 2 && this.array[0][0] === 0 && this.array[0][1] === 0 && this.array[0][2] == 1 && this.array[1][2]) {
                if (this.array[1][2] > 1) {
                    this.array[1][2]--;
                } else {
                    this.array.splice(1, 1);
                }
                this.array[0][2] = 10;
            }
            if (this.array.length >= 2 && this.array[0][0] === 0 && this.array[0][1] === 0 && (this.array[1][0] > 0 || this.array[1][1] != 1)) {
                if (this.array[0][2]) {
                    this.array.splice(1, 0, [this.array[1][0], this.array[1][1] - 1, this.array[0][2]]);
                }

                this.array[0][2] = 1;
                if (this.array[2][2] > 1) {
                    this.array[2][2]--;
                }
                else {
                    this.array.splice(2, 1);
                }

                if (this.array[1][1] == -1) {
                    this.array[1] = [this.array[1][0] - 1, this.array[1][2], 1];
                    this.array[0][2] = 10;
                }
                b = true;
            }
            for (let i = 1; i < this.array.length; ++i) {
                if (this.array[i][1] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                    if (i != this.array.length - 1 && this.array[i + 1][0] == this.array[i][0] + 1) {
                        this.array[i + 1][0]++;
                    } else {
                        this.array.splice(i + 1, 0, [this.array[i][0] + 1, 0, 1]);
                        b = true;
                    }
                    if (this.array[0][0] === 0 && this.array[0][1] === 0) {
                        this.array[0][2] = this.array[i][1] + 1;
                    } else {
                        this.array.splice(0, 0, [0, 0, this.array[i][1] + 1]);
                    }
                    this.array.splice(1, i);
                    b = true;
                }
                if (this.array[i][2] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                    if (i != this.array.length - 1 && this.array[i + 1][0] == this.array[i][0] + 1) {
                        this.array[i + 1][2]++;
                    } else {
                        this.array.splice(i + 1, 0, [this.array[i][0], this.array[i][1] + 1, 1]);
                    }
                    if (this.array[0][0] === 0 && this.array[0][1] === 0) {
                        this.array[0][2] = this.array[i][2] + 1;
                    } else {
                        this.array.splice(0, 0, [0, 0, this.array[i][2] + 1]);
                    }
                    this.array.splice(1, i);
                    b = true;
                }
            }
        }
        while (b);

        if (!this.array.length)
            this.array = [[0, 0, 0]];

        return this;
    }

    /**
     * Adds another MegotaNumber to this MegotaNumber.
     * 
     * @param other The other MegotaNumber to add.
     * @returns A new MegotaNumber that is the sum of this and the other.
     */
    public add(other: MegotaNumber): MegotaNumber {
        const x = this.clone();

        if (x.sign == -1)
            return x.negate().add(other.negate()).negate();

        if (other.sign == -1)
            return x.sub(other.negate());

        if (x.equals(MegotaNumber.ZERO))
            return other;

        if (other.equals(MegotaNumber.ZERO))
            return x;

        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite() && x.equals(other.negate()))
            return MegotaNumber.NaN.clone();

        if (x.isInfinite())
            return x;

        if (other.isInfinite())
            return other;

        const p = x.min(other);
        const q = x.max(other);
        const op0 = q.operator([0, 0]);
        const op1 = q.operator([0, 1]);

        let t: MegotaNumber | undefined;
        if (q.greaterThan(MegotaNumber.E_MAX_SAFE_INTEGER) || q.div(p).greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
            t = q;
        }
        else if (!op1) {
            t = MegotaNumber.fromNumber(x.toNumber() + other.toNumber());
        }
        else if (op1 == 1) {
            const a = p.operator([0, 1]) ? p.operator([0, 0]) : Math.log10(p.operator([0, 0]));
            t = MegotaNumber.fromOmegaNum([a + Math.log10(Math.pow(10, op0 - a) + 1), 1]);
        }

        return t || MegotaNumber.NaN.clone();
    }

    /**
     * Subtracts another MegotaNumber from this MegotaNumber.
     * 
     * @param other The other MegotaNumber to subtract.
     * @returns A new MegotaNumber that is the result of the subtraction.
     */
    public sub(other: MegotaNumber): MegotaNumber {
        const x = this.clone();

        if (x.sign == -1)
            return x.negate().sub(other.negate()).negate();

        if (other.sign == -1)
            return x.add(other.negate());

        if (x.equals(other))
            return MegotaNumber.ZERO.clone();

        if (other.equals(MegotaNumber.ZERO))
            return x;

        if (x.isNaN() || other.isNaN() || x.isInfinite() && other.isInfinite())
            return MegotaNumber.NaN.clone();

        if (x.isInfinite())
            return x;

        if (other.isInfinite())
            return other.negate();

        const p = x.min(other);
        const q = x.max(other);
        const n = other.greaterThan(x);
        const op0 = q.operator([0, 0]);
        const op1 = q.operator([0, 1]);

        let t: MegotaNumber | undefined;
        if (q.greaterThan(MegotaNumber.E_MAX_SAFE_INTEGER) || q.div(p).greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
            t = q;
            t = n ? t.negate() : t;
        }
        else if (!op1) {
            t = MegotaNumber.fromNumber(x.toNumber() - other.toNumber());
        }
        else if (op1 == 1) {
            const a = p.operator([0, 1]) ? p.operator([0, 0]) : Math.log10(p.operator([0, 0]));
            t = MegotaNumber.fromOmegaNum([a + Math.log10(Math.pow(10, op0 - a) - 1), 1]);
            t = n ? t.negate() : t;
        }

        return t || MegotaNumber.NaN.clone();
    }

    /**
     * Multiplies this MegotaNumber by another MegotaNumber.
     * 
     * @param other The other MegotaNumber to multiply with.
     * @returns A new MegotaNumber that is the product of this and the other.
     */
    public mul(other: MegotaNumber): MegotaNumber {
        const x = this.clone();

        if (x.sign * other.sign == -1)
            return x.abs().mul(other.abs()).negate();

        if (x.sign == -1)
            return x.abs().mul(other.abs());

        if (x.isNaN() || other.isNaN() || x.equals(MegotaNumber.ZERO) && other.isInfinite() || x.isInfinite() && other.abs().equals(MegotaNumber.ZERO))
            return MegotaNumber.NaN.clone();

        if (other.equals(MegotaNumber.ZERO))
            return MegotaNumber.ZERO.clone();

        if (other.equals(MegotaNumber.ONE))
            return x.clone();

        if (x.isInfinite())
            return x;

        if (other.isInfinite())
            return other;

        if (x.max(other).greaterThan(MegotaNumber.EE_MAX_SAFE_INTEGER))
            return x.max(other);

        const n = x.toNumber() * other.toNumber();
        if (n <= PrimitiveConstants.MAX_SAFE_INTEGER)
            return MegotaNumber.fromNumber(n);
        return MegotaNumber.TEN.pow(x.log10().add(other.log10()));
    }    /**
     * Divides this MegotaNumber by another MegotaNumber.
     * 
     * This method handles division with special cases for signs, zero, infinity, and very large numbers.
     * For regular numbers, it uses the property that a/b = 10^(log10(a) - log10(b)) to compute the result.
     * 
     * @param divisor The MegotaNumber to divide by.
     * @returns A new MegotaNumber that is the result of the division.
     */
    public div(divisor: MegotaNumber): MegotaNumber {
        const dividend = this.clone();

        // Handle sign differences - if signs are different, result is negative
        if (dividend.sign * divisor.sign == -1)
            return dividend.abs().div(divisor.abs()).negate();

        // If dividend is negative, convert to positive division case
        if (dividend.sign == -1)
            return dividend.abs().div(divisor.abs());

        // Handle special cases that return NaN:
        // - Either number is NaN
        // - Both numbers are infinite (∞/∞ is undefined)
        // - Both numbers are zero (0/0 is undefined)
        if (dividend.isNaN() || divisor.isNaN() ||
            (dividend.isInfinite() && divisor.isInfinite()) ||
            (dividend.equals(MegotaNumber.ZERO) && divisor.equals(MegotaNumber.ZERO)))
            return MegotaNumber.NaN.clone();

        // Division by zero results in infinity
        if (divisor.equals(MegotaNumber.ZERO))
            return MegotaNumber.POSITIVE_INFINITY.clone();

        // Division by one returns the unchanged dividend
        if (divisor.equals(MegotaNumber.ONE))
            return dividend.clone();

        // Dividing equal numbers gives 1
        if (dividend.equals(divisor))
            return MegotaNumber.ONE.clone();

        // Infinity divided by a finite number is still infinity
        if (dividend.isInfinite())
            return dividend;

        // Finite number divided by infinity is zero
        if (divisor.isInfinite())
            return MegotaNumber.ZERO.clone();

        // Shortcut for extremely large numbers: if either number is too large
        // - If dividend > divisor, result is approximately dividend
        // - If dividend < divisor, result is approximately zero
        if (dividend.max(divisor).greaterThan(MegotaNumber.EE_MAX_SAFE_INTEGER))
            return dividend.greaterThan(divisor) ? dividend.clone() : MegotaNumber.ZERO.clone();

        // For normal-sized numbers, try direct calculation
        const directResult = dividend.toNumber() / divisor.toNumber();
        if (directResult <= PrimitiveConstants.MAX_SAFE_INTEGER)
            return MegotaNumber.fromNumber(directResult);

        // For larger results, use logarithmic division:
        // a/b = 10^(log10(a) - log10(b))
        const logarithmicResult = MegotaNumber.TEN.pow(dividend.log10().sub(divisor.log10()));

        // Handle potential floating point issues by rounding to nearest integer if very close
        const flooredResult = logarithmicResult.floor();
        const isVeryCloseToInteger = logarithmicResult.sub(flooredResult).lessThan(MegotaNumber.fromNumber(1e-9));

        return isVeryCloseToInteger ? flooredResult : logarithmicResult;
    }

    /**
     * Calculates the reciprocal of this MegotaNumber.
     * 
     * Equivalent to `1 / this`.
     * 
     * @returns A new MegotaNumber that is the reciprocal of this number.
     */
    public reciprocal(): MegotaNumber {
        if (this.isNaN() || this.equals(MegotaNumber.ZERO))
            return MegotaNumber.NaN.clone();

        if (this.abs().greaterThan(MegotaNumber.RECIP_MAX))
            return MegotaNumber.ZERO.clone();
        
        return MegotaNumber.fromNumber(1 / this.toNumber());
    }

    /**
     * Calculates the modulo of this MegotaNumber with another MegotaNumber.
     * 
     * @param other The other MegotaNumber to calculate the modulo with.
     * @returns A new MegotaNumber that is the result of the modulo operation.
     */
    public modulo(other: MegotaNumber): MegotaNumber {
        if (other.isNaN())
            return MegotaNumber.NaN.clone();

        if (other.equals(MegotaNumber.ZERO))
            return MegotaNumber.ZERO.clone();

        if (this.sign * other.sign == -1)
            return this.abs().modulo(other.abs()).negate();

        if (this.sign == -1)
            return this.abs().modulo(other.abs()).negate();

        return this.sub(this.div(other).floor().mul(other));
    }

    /**
     * Calculates the gamma function of this MegotaNumber.
     * 
     * The gamma function is defined as Γ(n) = (n-1)! for positive integers n.
     * However, it is also defined for non-integer values.
     * 
     * @returns A new MegotaNumber that is the result of the gamma function.
     */
    public gamma(): MegotaNumber {
        const x = this.clone();
        if (x.greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
            return x;
        if (x.greaterThan(MegotaNumber.E_MAX_SAFE_INTEGER))
            return x.exp();
        if (x.greaterThan(MegotaNumber.MAX_SAFE_INTEGER))
            return x.mul(x.ln().sub(MegotaNumber.ONE)).exp();

        const n = x.operator([0, 0]);
        if (n > 1) {
            if (n < 24) return MegotaNumber.fromNumber(f_gamma(x.sign * n));
            const t = n - 1;
            let l = 0.9189385332046727; //0.5*Math.log(2*Math.PI)
            l += ((t + 0.5) * Math.log(t));
            l -= t;
            const n2 = t * t;
            let np = t;
            let lm = 12 * np;
            let adj = 1 / lm;
            let l2 = l + adj;
            if (l2 == l)
                return MegotaNumber.fromNumber(l).exp();
            l = l2;
            np *= n2;
            lm = 360 * np;
            adj = 1 / lm;
            l2 = l - adj;
            if (l2 == l)
                return MegotaNumber.fromNumber(l).exp();
            l = l2;
            np *= n2;
            lm = 1260 * np;
            let lt = 1 / lm;
            l += lt;
            np *= n2;
            lm = 1680 * np;
            lt = 1 / lm;
            l -= lt;
            return MegotaNumber.fromNumber(l).exp();
        }

        return this.reciprocal();
    }

    /**
     * Calculates the factorial of this MegotaNumber.
     * 
     * The factorial is defined as n! = n * (n-1) * (n-2) * ... * 1 for positive integers n.
     * It is also defined for non-integer values using the gamma function.
     * 
     * @returns A new MegotaNumber that is the result of the factorial operation.
     */
    public factorial(): MegotaNumber {
        const x = this.clone();

        if (x.lessThan(MegotaNumber.ZERO) || !x.isInteger())
            return x.add(MegotaNumber.ONE).gamma();

        if (x.lessThanOrEquals(MegotaNumber.fromNumber(170)))
            return MegotaNumber.fromNumber(factorials[+x]);

        const errorFixer = 1;
        let e = +x;
        if (e < 500) e += 163879 / 209018880 * Math.pow(e, 5);
        if (e < 1000) e += -571 / 2488320 * Math.pow(e, 4);
        if (e < 50000) e += -139 / 51840 * Math.pow(e, 3);
        if (e < 1e7) e += 1 / 288 * Math.pow(e, 2);
        if (e < 1e20) e += 1 / 12 * e;
        return x.div(MegotaNumber.E).pow(x).mul(x.mul(MegotaNumber.PI).mul(MegotaNumber.TWO).sqrt()).mul(MegotaNumber.fromNumber(errorFixer));
    }

    /**
     * Raises this MegotaNumber to the power of another MegotaNumber.
     * 
     * @param other The exponent MegotaNumber.
     * @returns A new MegotaNumber that is the result of the exponentiation.
     */
    public pow(other: MegotaNumber): MegotaNumber {
        if (other.equals(MegotaNumber.ZERO))
            return MegotaNumber.ONE.clone();

        if (other.equals(MegotaNumber.ONE))
            return this.clone();

        if (other.lessThan(MegotaNumber.ZERO))
            return this.pow(other.negate()).reciprocal();

        if (this.lessThan(MegotaNumber.ZERO) && other.isInteger()) {
            if (other.modulo(MegotaNumber.TWO).lessThan(MegotaNumber.ONE))
                return this.abs().pow(other);

            return this.abs().pow(other).negate();
        }

        if (this.lessThan(MegotaNumber.ZERO))
            return MegotaNumber.NaN.clone();

        if (this.equals(MegotaNumber.ONE))
            return MegotaNumber.ONE.clone();

        if (this.equals(MegotaNumber.ZERO))
            return MegotaNumber.ZERO.clone();

        if (this.max(other).greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
            return this.max(other);

        if (this.equals(MegotaNumber.TEN)) {
            if (other.greaterThan(MegotaNumber.ZERO)) {
                other.operator([0, 1], (other.operator([0, 1]) + 1) || 1);
                other.normalize();
                return other;
            } else {
                return MegotaNumber.fromNumber(Math.pow(10, other.toNumber()));
            }
        }

        if (other.lessThan(MegotaNumber.ONE))
            return this.root(other.reciprocal());

        const n = Math.pow(this.toNumber(), other.toNumber());
        if (n <= PrimitiveConstants.MAX_SAFE_INTEGER)
            return MegotaNumber.fromNumber(n);

        return MegotaNumber.TEN.pow(this.log10().mul(other));
    }

    /**
     * Raises Euler's number (e) to the power of this MegotaNumber.
     * 
     * @returns A new MegotaNumber that is e raised to the power of this number.
     */
    public exp(): MegotaNumber {
        return MegotaNumber.E.pow(this);
    }

    /**
     * Calculates the square root of this MegotaNumber.
     * 
     * @returns A new MegotaNumber that is the square root of this number.
     */
    public sqrt(): MegotaNumber {
        return this.root(MegotaNumber.TWO);
    }

    /**
     * Calculates the cube root of this MegotaNumber.
     * 
     * @returns A new MegotaNumber that is the cube root of this number.
     */
    public cbrt(): MegotaNumber {
        return this.root(MegotaNumber.THREE);
    }

    /**
     * Calculates the nth root of this MegotaNumber.
     * 
     * @param other The MegotaNumber representing the degree of the root.
     * @returns A new MegotaNumber that is the nth root of this number.
     */
    public root(other: MegotaNumber): MegotaNumber {
        if (other.equals(MegotaNumber.ONE))
            return this.clone();

        if (other.lessThan(MegotaNumber.ZERO))
            return this.root(other.negate()).reciprocal();

        if (other.lessThan(MegotaNumber.ONE))
            return this.pow(other.reciprocal());

        if (this.lessThan(MegotaNumber.ZERO) && other.isInteger() && other.modulo(MegotaNumber.TWO).equals(MegotaNumber.ONE))
            return this.negate().root(other).negate();

        if (this.lessThan(MegotaNumber.ZERO))
            return MegotaNumber.NaN.clone();

        if (this.equals(MegotaNumber.ONE))
            return MegotaNumber.ONE.clone();

        if (this.equals(MegotaNumber.ZERO))
            return MegotaNumber.ZERO.clone();

        if (this.max(other).greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
            return this.greaterThan(other) ? this.clone() : MegotaNumber.ZERO.clone();

        return MegotaNumber.TEN.pow(this.log10().div(other));
    }

    /**
     * Calculates the logarithm base 10 of this MegotaNumber.
     * 
     * @returns A new MegotaNumber that is the logarithm base 10 of this number.
     */
    public log10(): MegotaNumber {
        const x = this.clone();

        if (x.lessThan(MegotaNumber.ZERO))
            return MegotaNumber.NaN.clone();

        if (x.equals(MegotaNumber.ZERO))
            return MegotaNumber.NEGATIVE_INFINITY.clone();

        if (x.lessThanOrEquals(MegotaNumber.MAX_SAFE_INTEGER))
            return MegotaNumber.fromNumber(Math.log10(x.toNumber()));

        if (!x.isFinite())
            return x;

        if (x.greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
            return x;

        x.operator([0, 1], x.operator([0, 1]) - 1);
        return x.normalize();
    }

    /**
     * Calculates the logarithm of this MegotaNumber with respect to a specified base.
     * 
     * @param base The base for the logarithm (default is e).
     * @returns A new MegotaNumber that is the logarithm of this number with respect to the specified base.
     */
    public log(base = MegotaNumber.E): MegotaNumber {
        return this.log10().div(base.log10());
    }

    /**
     * Calculates the natural logarithm (base e) of this MegotaNumber.
     * 
     * @returns A new MegotaNumber that is the natural logarithm of this number.
     */
    public ln(): MegotaNumber {
        return this.log(MegotaNumber.E);
    }

    /**
     * Calculates the Lambert W function of this MegotaNumber.
     * 
     * The Lambert W function is defined as the inverse function of f(W) = W * e^W.
     * 
     * Uses Halley's method for numerical approximation. Do not use this method directly; use {@link lambertw} instead.
     * 
     * @see https://en.wikipedia.org/wiki/Halley%27s_method
     * 
     * @param principal If true, returns the principal branch of the Lambert W function (default is true).
     * @return A new MegotaNumber that is the result of the Lambert W function.
     */
    private halley_method(tol = 1e-10, principal = true): MegotaNumber {
        let w: MegotaNumber;
        if (!this.isFinite())
            return this;

        if (principal) {
            if (this.equals(MegotaNumber.ZERO))
                return this;

            if (this.equals(MegotaNumber.ONE))
                return MegotaNumber.fromNumber(OMEGA);

            w = this.ln();
        }
        else {
            if (this.equals(MegotaNumber.ZERO))
                return MegotaNumber.NEGATIVE_INFINITY.clone();
            w = this.negate().ln();
        }
        for (let i = 0; i < 100; ++i) {
            const ew = w.negate().exp();
            const wewz = w.sub(this.mul(ew));
            const dd = w.add(MegotaNumber.ONE).sub(w.add(MegotaNumber.TWO).mul(wewz).div(MegotaNumber.TWO.mul(w).add(MegotaNumber.TWO)));
            if (dd.equals(MegotaNumber.ZERO))
                return w;

            const wn = w.sub(wewz.div(dd));
            if (wn.sub(w).abs().lessThan(wn.abs().mul(MegotaNumber.fromNumber(tol)))) // convergence check
                return wn;
            w = wn;
        }
        throw new LambertWError("Iteration failed to converge: " + this);
    }

    /**
     * Calculates the Lambert W function of this MegotaNumber.
     * 
     * The Lambert W function is defined as the inverse function of f(W) = W * e^W.
     * 
     * @see https://en.wikipedia.org/wiki/Lambert_W_function
     * 
     * @param principal If true, returns the principal branch of the Lambert W function (default is true).
     * @returns A new MegotaNumber that is the result of the Lambert W function.
     */
    public lambertw(principal = true): MegotaNumber {
        const x = this.clone();
        if (x.isNaN())
            return x;

        if (x.lessThan(MegotaNumber.NEGATIVE_E_RECIP))
            return MegotaNumber.NaN.clone();

        if (principal) {
            if (x.greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
                return x;

            if (x.greaterThan(MegotaNumber.EE_MAX_SAFE_INTEGER)) {
                x.operator([0, 1], x.operator([0, 1]) - 1);
                return x;
            }

            if (x.greaterThan(MegotaNumber.MAX_SAFE_INTEGER))
                return x.halley_method();

            return MegotaNumber.fromNumber(f_lambertw(x.sign * x.operator([0, 0])));
        }
        else {
            if (x.isPositiveInfinity())
                return MegotaNumber.NaN.clone();

            if (x.abs().greaterThan(MegotaNumber.EE_MAX_SAFE_INTEGER))
                return x.negate().reciprocal().lambertw().negate();

            if (x.abs().greaterThan(MegotaNumber.MAX_SAFE_INTEGER))
                return x.halley_method(1e-10, false);

            return MegotaNumber.fromNumber(f_lambertw(x.sign * x.operator([0, 0]), 1e-10, false));
        }
    }

    /**
     * Calculates the tetration of this MegotaNumber to another MegotaNumber.
     * 
     * Tetration is repeated exponentiation, defined as a power tower of height `other`.
     * 
     * @param other The height of the power tower.
     * @param payload An optional payload to adjust the result (default is MegotaNumber.ONE).
     * @returns A new MegotaNumber that is the result of the tetration.
     */
    public tetrate(other: MegotaNumber, payload = MegotaNumber.ONE): MegotaNumber {
        const t = this.clone();
        if (!payload.equals(MegotaNumber.ONE)) {
            other = other.add(payload.slog(t));
        }

        if (t.isNaN() || other.isNaN() || payload.isNaN())
            return MegotaNumber.NaN.clone();

        let negln;
        if (other.isInfinite() && other.sign > 0) {
            if (t.greaterThanOrEquals(MegotaNumber.EXP_E_RECIP))
                return MegotaNumber.POSITIVE_INFINITY.clone();

            //Formula for infinite height power tower.
            negln = t.ln().negate();
            return negln.lambertw().div(negln);
        }

        if (other.lessThanOrEquals(MegotaNumber.NEGATIVE_TWO))
            return MegotaNumber.NaN.clone();

        if (t.equals(MegotaNumber.ZERO)) {
            if (other.equals(MegotaNumber.ZERO))
                return MegotaNumber.NaN.clone();

            if (other.modulo(MegotaNumber.TWO).equals(MegotaNumber.ZERO))
                return MegotaNumber.ZERO.clone();

            return MegotaNumber.ONE.clone();
        }

        if (t.equals(MegotaNumber.ONE)) {
            if (other.equals(MegotaNumber.ONE.negate()))
                return MegotaNumber.NaN.clone();
            return MegotaNumber.ONE.clone();
        }

        if (other.equals(MegotaNumber.NEGATIVE_ONE))
            return MegotaNumber.ZERO.clone();

        if (other.equals(MegotaNumber.ZERO))
            return MegotaNumber.ONE.clone();

        if (other.equals(MegotaNumber.ONE))
            return t;

        if (other.equals(MegotaNumber.TWO))
            return t.pow(t);

        if (t.equals(MegotaNumber.TWO)) {
            if (other.equals(MegotaNumber.THREE))
                return MegotaNumber.fromNumber(16);
            if (other.equals(MegotaNumber.FOUR))
                return MegotaNumber.fromNumber(65536);
        }

        const m = t.max(other);
        if (m.greaterThan(MegotaNumber.PENTATED_MAX_SAFE_INTEGER))
            return m;

        if (m.greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER) || other.greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
            if (this.lessThan(MegotaNumber.EXP_E_RECIP)) {
                negln = t.ln().negate();
                return negln.lambertw().div(negln);
            }

            const j = t.slog(MegotaNumber.TEN).add(other);
            j.operator([0, 2], (j.operator([0, 2]) || 0) + 1);
            j.normalize();
            return j;
        }


        const y = other.toNumber();
        let f = Math.floor(y);
        let r = t.pow(MegotaNumber.fromNumber(y - f));
        let l = MegotaNumber.NaN;

        let i: number;
        let w: MegotaNumber;
        for (i = 0, w = MegotaNumber.E_MAX_SAFE_INTEGER; f !== 0 && r.lessThan(w) && i < 100; ++i) {
            if (f > 0) {
                r = t.pow(r);
                if (l.equals(r)) {
                    f = 0;
                    break;
                }
                l = r;
                --f;
            }
            else {
                r = r.log(t);
                if (l.equals(r)) {
                    f = 0;
                    break;
                }
                l = r;
                ++f;
            }
        }

        if (i == 100 || this.lessThan(MegotaNumber.EXP_E_RECIP)) {
            f = 0;
        }
        r.operator([0, 1], (r.operator([0, 1]) + f) || f);
        r.normalize();

        return r;
    }

    /**
     * Calculates the super-logarithm of this MegotaNumber with respect to a specified base.
     * 
     * The super-logarithm is the inverse of tetration, defined as the height of the power tower needed to reach this number.
     * 
     * @param base The base for the super-logarithm (default is MegotaNumber.TEN).
     * @returns A new MegotaNumber that is the super-logarithm of this number with respect to the specified base.
     */
    public slog(base = MegotaNumber.TEN): MegotaNumber {
        if (this.isNaN() || base.isNaN() || this.isInfinite() && base.isInfinite())
            return MegotaNumber.NaN.clone();

        if (this.isInfinite())
            return this.clone();

        if (base.isInfinite())
            return MegotaNumber.ZERO.clone();

        if (this.lessThan(MegotaNumber.ZERO))
            return MegotaNumber.NEGATIVE_ONE.clone();

        if (this.equals(MegotaNumber.ONE))
            return MegotaNumber.ZERO.clone();

        if (this.equals(base))
            return MegotaNumber.ONE.clone();

        if (base.lessThan(MegotaNumber.EXP_E_RECIP)) {
            const a = base.tetrate(MegotaNumber.POSITIVE_INFINITY);
            if (this.equals(a))
                return MegotaNumber.POSITIVE_INFINITY.clone();
            if (this.greaterThan(a))
                return MegotaNumber.NaN.clone();
        }

        let x = this.clone();

        if (x.max(base).greaterThan(MegotaNumber.PENTATED_MAX_SAFE_INTEGER)) {
            if (x.greaterThan(base))
                return x;
            return MegotaNumber.ZERO.clone();
        }

        if (x.max(base).greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER)) {
            if (x.greaterThan(base)) {
                x.operator([0, 2], x.operator([0, 2]) - 1);
                x.normalize();
                return x.sub(MegotaNumber.fromNumber(x.operator([0, 1])));
            }
            return MegotaNumber.ZERO.clone();
        }

        let r = 0;
        const t = (x.operator([0, 1]) || 0) - (base.operator([0, 1]) || 0);
        if (t > 3) {
            const l = t - 3;
            r += l;
            x.operator([0, 1], x.operator([0, 1]) - l);
        }

        for (let i = 0; i < 100; ++i) {
            if (x.lessThan(MegotaNumber.ZERO)) {
                x = base.pow(x);
                --r;
            }
            else if (x.lessThanOrEquals(MegotaNumber.ONE)) {
                return MegotaNumber.fromNumber(r + x.toNumber() - 1);
            }
            else {
                ++r;
                x = x.log(base);
            }
        }

        if (x.greaterThan(MegotaNumber.TEN)) {
            return MegotaNumber.fromNumber(r);
        }

        // If we reach here, it means we didn't converge to a solution.
        return MegotaNumber.NaN.clone();
    }

    /**
     * Addition in tetrational space. This is **NOT** the same as normal addition.
     * 
     * Equivalent to `base.tetrate(this.slog(base) + other)`.
     * 
     * @param other The MegotaNumber to add (default is MegotaNumber.ONE). 
     * @param base The base for tetration (default is MegotaNumber.TEN).
     * @returns A new MegotaNumber that is the result of the tetration addition.
     */
    public tetrateAdd(other = MegotaNumber.ONE, base = MegotaNumber.TEN): MegotaNumber {
        return base.tetrate(this.slog(base).add(other));
    }

    /**
     * Calculates the super-square root of this MegotaNumber. This is **NOT** the same as normal square root.
     * 
     * The super-square root is defined as the solution to the equation `x^2 = this`.
     * 
     * @see https://en.wikipedia.org/wiki/Super-root
     * 
     * @returns A new MegotaNumber that is the super-square root of this number.
     */
    public ssqrt(): MegotaNumber {
        const x = this.clone();

        if (x.lessThan(MegotaNumber.EXP_NEGATIVE_E_RECIP))
            return MegotaNumber.NaN.clone();

        if (!x.isFinite())
            return x;

        if (x.greaterThan(MegotaNumber.TETRATED_MAX_SAFE_INTEGER))
            return x;

        if (x.greaterThan(MegotaNumber.EE_MAX_SAFE_INTEGER)) {
            x.operator([0, 1], x.operator([0, 1]) - 1);
            return x;
        }

        const l = x.ln();
        return l.div(l.lambertw());
    }

    /**
     * Creates an arrow function for hyperoperations based on the number of arrows.
     * 
     * This function allows you to perform hyperoperations like multiplication, exponentiation, and tetration
     * based on the number of arrows specified.
     * 
     * Common hyperoperations:
     * - 0 arrows: Multiplication (a * b)
     * - 1 arrow: Exponentiation (a ↑ b)
     * - 2 arrows: Tetration (a ↑↑ b)
     * - 3 arrows: Pentation (a ↑↑↑ b)
     * - 4 arrows: Hexation (a ↑↑↑↑ b)
     * - ...
     * - 100 arrows: Decation (a ↑↑↑...↑ b, 100 times)
     * - ...and so on.
     * 
     * @param arrows The number of arrows to determine the hyperoperation level.
     * @returns A function that takes another MegotaNumber and returns the result of the hyperoperation.
     */
    public arrow(arrows: MegotaNumber): (other: MegotaNumber, depth?: number) => MegotaNumber {
        const t = this.clone();

        if (!arrows.isInteger() || arrows.lessThan(MegotaNumber.ZERO))
            return () => MegotaNumber.NaN.clone();

        if (arrows.equals(MegotaNumber.ZERO))
            return (other) => t.mul(other);

        if (arrows.equals(MegotaNumber.ONE))
            return (other) => t.pow(other);

        if (arrows.equals(MegotaNumber.TWO))
            return (other) => t.tetrate(other);


        return (other: MegotaNumber, depth: number = 0) => {
            if (t.isNaN() || other.isNaN())
                return MegotaNumber.NaN.clone();

            if (other.lessThan(MegotaNumber.ZERO))
                return MegotaNumber.NaN.clone();

            if (t.equals(MegotaNumber.ZERO)) {
                if (other.equals(MegotaNumber.ONE))
                    return MegotaNumber.ZERO.clone();

                return MegotaNumber.NaN.clone();
            }

            if (t.equals(MegotaNumber.ONE))
                return MegotaNumber.ONE.clone();

            if (other.equals(MegotaNumber.ZERO))
                return MegotaNumber.ONE.clone();

            if (other.equals(MegotaNumber.ONE))
                return t.clone();

            let r: MegotaNumber;
            if (arrows.greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
                r = arrows.clone();
                r.array.push([1, 0, 1]);
                return r.normalize();
            }

            const arrowsNum = arrows.toNumber();
            if (other.equals(MegotaNumber.TWO))
                return t.arrow(MegotaNumber.fromNumber(arrowsNum - 1))(t, depth + 1);

            if (t.max(other).greaterThan(MegotaNumber.fromString("10{" + (arrowsNum + 1) + "}" + MegotaNumber.MAX_SAFE_INTEGER)))
                return t.max(other);

            if (t.greaterThan(MegotaNumber.fromString("10{" + arrowsNum + "}" + MegotaNumber.MAX_SAFE_INTEGER)) || other.greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
                if (t.greaterThan(MegotaNumber.fromString("10{" + arrowsNum + "}" + MegotaNumber.MAX_SAFE_INTEGER))) {
                    r = t.clone();
                    r.operator([0, arrowsNum], r.operator([0, arrowsNum]) - 1);
                    r.normalize();
                }
                else if (t.greaterThan(MegotaNumber.fromString("10{" + (arrowsNum - 1) + "}" + MegotaNumber.MAX_SAFE_INTEGER))) {
                    r = MegotaNumber.fromNumber(t.operator([0, arrowsNum - 1]));
                }
                else {
                    r = MegotaNumber.ZERO;
                }

                const j = r.add(other);
                j.operator([0, arrowsNum], (j.operator([0, arrowsNum]) || 0) + 1);
                return j.normalize();
            }

            if (depth >= MegotaNumber.maxOps + 10) {
                const result = new MegotaNumber();
                result.array = [[0, 0, 10], [0, arrowsNum, 1]];
                return result;
            }

            const y = other.toNumber();
            let f = Math.floor(y);
            const arrows_m1 = arrows.sub(MegotaNumber.ONE);
            r = t.arrow(arrows_m1)(MegotaNumber.fromNumber(y - f), depth + 1);
            let i: number, m: MegotaNumber;
            for (i = 0, m = MegotaNumber.fromString("10{" + (arrowsNum - 1) + "}" + MegotaNumber.MAX_SAFE_INTEGER); f !== 0 && r.lessThan(m) && i < 100; ++i) {
                if (f > 0) {
                    r = t.arrow(arrows_m1)(r, depth + 1);
                    --f;
                }
            }

            if (i == 100)
                f = 0;

            r.operator([0, arrowsNum - 1], (r.operator([0, arrowsNum - 1]) + f) || f);
            r.normalize();
            return r;
        };
    }

    /**
     * Returns a hyperoperation function for the given level.
     * 
     * Common hyperoperations include:
     * - Level 0: Addition (a + b)
     * - Level 1: Multiplication (a * b)
     * - Level 2: Exponentiation (a ↑ b)
     * - Level 3: Tetration (a ↑↑ b)
     * - Level 4: Pentation (a ↑↑↑ b)
     * - ...and so on.
     * 
     * @see https://en.wikipedia.org/wiki/Hyperoperation
     * 
     * @param level The level of the hyperoperation.
     * @returns A function that takes two MegotaNumbers and applies the hyperoperation.
     */
    public static hyperoperation(level: MegotaNumber): (a: MegotaNumber, b: MegotaNumber) => MegotaNumber {
        if (level.equals(MegotaNumber.ZERO))
            return (a, b) => b.equals(MegotaNumber.ZERO) ? a.clone() : a.add(MegotaNumber.ONE);
        if (level.equals(MegotaNumber.ONE))
            return (a, b) => a.add(b);

        return (a, b) => a.arrow(level.sub(MegotaNumber.TWO))(b);
    }

    /**
     * Returns a hyperoperation function for the given level, starting from this MegotaNumber.
     * 
     * Common hyperoperations include:
     * - Level 0: Addition (this + other)
     * - Level 1: Multiplication (this * other)
     * - Level 2: Exponentiation (this ↑ other)
     * - Level 3: Tetration (this ↑↑ other)
     * - Level 4: Pentation (this ↑↑↑ other)
     * - ...and so on.
     * 
     * @see https://en.wikipedia.org/wiki/Hyperoperation
     * 
     * @param level The level of the hyperoperation.
     * @returns A function that takes another MegotaNumber and applies the hyperoperation.
     */
    public hyperoperation(level: MegotaNumber): (other: MegotaNumber) => MegotaNumber {
        if (level.equals(MegotaNumber.ZERO))
            return (other) => this.add(other);
        if (level.equals(MegotaNumber.ONE))
            return (other) => this.mul(other);

        return this.arrow(level.sub(MegotaNumber.TWO));
    }

    /**
     * Calculates the expansion of this MegotaNumber to another MegotaNumber.
     * 
     * Expansion refers to the binary function `a{{1}}b`, defined as `a{a{...{a}...}a}a   (with b total a's, nested from the center out)`
     * 
     * @example
     * Consider 2{{1}}3: This is equivalent to 2{2}2, or 2 tetrated to 2 = 4.
     * Consider 3{{1}}2: This is equivalent to 3{3{3}3}3, which is 3{7625597484987}3 (so 7625597484987 arrows).
     * 
     * @see https://googology.fandom.com/wiki/Expansion
     * 
     * @param other The MegotaNumber to expand this number to.
     * @returns A new MegotaNumber that is the result of the expansion.
     */
    public expansion(other: MegotaNumber): MegotaNumber {
        const t = this.clone();

        if (other.lessThanOrEquals(MegotaNumber.ZERO) || !other.isInteger())
            return MegotaNumber.NaN.clone();

        if (other.equals(MegotaNumber.ONE))
            return t.clone();

        if (!t.isInteger())
            return MegotaNumber.NaN.clone();

        if (t.equals(MegotaNumber.TWO))
            return MegotaNumber.FOUR.clone();

        let r: MegotaNumber;
        if (other.greaterThan(MegotaNumber.MAX_SAFE_INTEGER)) {
            r = other.clone();
            r.operator([1, 0], r.operator([1, 0]) + 1);
            r.normalize();
            return r;
        }

        r = t;
        let f = other.toNumber() - 1;
        for (let i = 0; f !== 0 && i < 100; ++i) {
            if (f > 0) {
                r = t.arrow(r)(t);
                --f;
            }
        }
        r.array[r.array.length - 1][2] += f;
        return r.normalize();
    }

    /**
     * Calculates the maximum number of terms in a geometric series that can be summed without exceeding a given limit.
     * 
     * The geometric series is defined as `S = a + ar + ar^2 + ... + ar^n`.
     * 
     * Use cases include how many times an item can be purchased in a game with a geometric cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
     * @example
     * const balance = MegotaNumber.fromNumber(1000);
     * const firstItemCost = MegotaNumber.fromNumber(10);
     * const nextItemCostRatio = MegotaNumber.fromNumber(2);
     * const owned = MegotaNumber.fromNumber(0);
     * MegotaNumber.maxTermsInGeometricSeries(balance, firstItemCost, nextItemCostRatio, owned); // returns 6
     * // 10 + 20 + 40 + 80 + 160 + 320 + 640 = 1270, which exceeds the balance of 1000, so the maximum is 6 terms.
     * 
     * @param sumLimit The maximum sum limit for the geometric series. In a game, this could be the amount of resources you have available to spend.
     * @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
     * @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The maximum number of terms that can be purchased without exceeding the sum limit.
     */
    public static maxTermsInGeometricSeries(sumLimit: MegotaNumber, firstTerm: MegotaNumber, ratio: MegotaNumber, offset: MegotaNumber): MegotaNumber {
        const actualStart = firstTerm.mul(ratio.pow(offset));
        return sumLimit.div(actualStart).mul(ratio.sub(MegotaNumber.ONE)).add(MegotaNumber.ONE).log10().div(ratio.log10()).floor();
    }

    /**
     * Calculates the maximum number of terms in an arithmetic series that can be summed without exceeding a given limit.
     * 
     * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + nd)`.
     * 
     * Use cases include how many times an item can be purchased in a game with an arithmetic cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
     * 
     * @example
     * const balance = MegotaNumber.fromNumber(1000);
     * const firstItemCost = MegotaNumber.fromNumber(100);
     * const nextItemCostDifference = MegotaNumber.fromNumber(50);
     * const owned = MegotaNumber.fromNumber(0);
     * MegotaNumber.maxTermsInArithmeticSeries(balance, firstItemCost, nextItemCostDifference, owned); // returns 5
     * // 100 + 150 + 200 + 250 + 300 + 350 = 1350, which exceeds the balance of 1000, so the maximum is 5 terms.
     * 
     * @param sumLimit The maximum sum limit for the arithmetic series. In a game, this could be the amount of resources you have available to spend.
     * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
     * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The maximum number of terms that can be purchased without exceeding the sum limit.
     */
    public static maxTermsInArithmeticSeries(sumLimit: MegotaNumber, firstTerm: MegotaNumber, difference: MegotaNumber, offset: MegotaNumber): MegotaNumber {
        const actualStart = firstTerm.add(offset.mul(difference));
        const b = actualStart.sub(difference.div(MegotaNumber.TWO));
        const b2 = b.pow(MegotaNumber.TWO);
        return b.negate().add(b2.add(difference.mul(sumLimit).mul(MegotaNumber.TWO)).sqrt()).div(difference).floor();
    }

    /**
     * Calculates the sum of a geometric series.
     * 
     * The geometric series is defined as `S = a + ar + ar^2 + ... + ar^(n-1)`.
     * 
     * Use cases include calculating the total cost of items in a game with a geometric cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
     * 
     * @param terms The number of terms in the geometric series.
     * @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
     * @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The sum of the geometric series.
     */
    public static sumGeometricSeries(terms: MegotaNumber, firstTerm: MegotaNumber, ratio: MegotaNumber, offset: MegotaNumber): MegotaNumber {
        return firstTerm.mul(ratio.pow(offset)).mul(MegotaNumber.ONE.sub(ratio.pow(terms))).div(MegotaNumber.ONE.sub(ratio));
    }

    /**
     * Calculates the sum of an arithmetic series.
     * 
     * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + (n-1)d)`.
     * 
     * Use cases include calculating the total cost of items in a game with an arithmetic cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
     * 
     * @param terms The number of terms in the arithmetic series.
     * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
     * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The sum of the arithmetic series.
     */
    public static sumArithmeticSeries(terms: MegotaNumber, firstTerm: MegotaNumber, difference: MegotaNumber, offset: MegotaNumber): MegotaNumber {
        const actualStart = firstTerm.add(offset.mul(difference));
        return terms.div(MegotaNumber.TWO).mul(actualStart.mul(MegotaNumber.TWO).add(terms.sub(MegotaNumber.ONE).mul(difference)));
    }

    /**
     * Calculates the binomial coefficient, also known as "n choose k".
     * 
     * @param k The number of items to choose.
     * @returns The binomial coefficient.
     */
    public choose(k: MegotaNumber) {
        return this.factorial().div(k.factorial().mul(this.sub(k).factorial()));
    }

    /**
     * Converts this MegotaNumber to a JSON representation.
     * 
     * @returns A JSON string or a string representation of the MegotaNumber.
     */
    public toJSON() {
        if (MegotaNumber.serializeMode === 1) {
            return this.toString();
        }

        return JSON.stringify({
            array: this.array,
            layer: this.layer,
            sign: this.sign
        });
    }

    /**
     * Converts this MegotaNumber to a JavaScript number.
     * 
     * If the number is beyond {@link MegotaNumber.MAX_SAFE_INTEGER}, it will return `Infinity`.
     * 
     * @returns A number representation of this MegotaNumber.
     */
    public toNumber(): number {
        if (this.sign == -1)
            return -this.abs().toNumber();
        if (this.greaterThan(MegotaNumber.MAX_SAFE_INTEGER))
            return Infinity;
        if (this.array.length >= 2 && this.array[1][2] == 1)
            return Math.pow(10, this.array[0][2]);
        return this.array[0][2];
    }

    /**
     * Converts this MegotaNumber to a string representation.
     * 
     * @returns A string representation of this MegotaNumber.
     */
    public toString(): string {
        if (this.sign == -1)
            return "-" + this.abs().toString();

        if (this.isNaN())
            return "NaN";

        if (this.isInfinite()) // only positive infinity is possible here
            return "Infinity";

        let s = "";
        if (!this.layer) s += "";
        else if (this.layer < 3) s += "N".repeat(this.layer);
        else s += "N^" + this.layer + " ";
        if (this.array.length >= 3 || this.array.length == 2 && (this.array[1][0] > 0 || this.array[1][1] >= 2)) {
            for (let i = this.array.length - 1; i >= 2; --i) {
                const e = this.array[i];
                const q = (e[0] > 0 || e[1] >= 5) ? `{${e[0] ? `${e[0]},` : ""}${e[1]}}` : `^`.repeat(e[1]);
                if (e[2] < 5) s += `10${q}`.repeat(e[2]);
                else s += "(10" + q + ")^" + e[2] + " ";
            }
        }
        const op0 = this.operator([0, 0]);
        const op1 = this.operator([0, 1]);
        if (!op1) s += String(op0);
        else if (op1 < 3) s += "e".repeat(op1 - 1) + Math.pow(10, op0 - Math.floor(op0)) + "e" + Math.floor(op0);
        else if (op1 < 8) s += "e".repeat(op1) + op0;
        else s += "(10^)^" + op1 + " " + op0;

        return s;
    }
    
    /**
     * Gets the index of the operator in the array.
     * 
     * This method performs a binary search to find the index of the operator in the sorted array.
     * 
     * If the operator does not exist, a decimal index is returned, indicating where it would be inserted.
     * 
     * @param searchOperator The operator to find, represented as [layer, exponent].
     * @returns The index of the operator, or a decimal value if not found (indicating insertion position).
     */
    public getOperatorIndex(searchOperator: [number, number]): number {
        const operatorArray = this.array;
        let minIndex = 0, maxIndex = operatorArray.length - 1;

        while (minIndex != maxIndex) {
            // Check if the operator is at the min or max positions first for quick returns

            // Check if operator at minIndex matches the search operator
            // Extract the first two elements (layer, exponent) and compare with searchOperator
            if (operatorArray[minIndex].slice(0, 2).map((element, index) => searchOperator[index] == element).reduce((acc, curr) => (acc && curr)))
                return minIndex;

            // Check if operator at maxIndex matches the search operator
            if (operatorArray[maxIndex].slice(0, 2).map((element, index) => searchOperator[index] == element).reduce((acc, curr) => (acc && curr)))
                return maxIndex;

            // Binary search: calculate midpoint
            const midIndex = Math.floor((minIndex + maxIndex) / 2);

            // If we can't narrow down further or found exact match at mid
            if (minIndex == midIndex ||
                operatorArray[midIndex].slice(0, 2).map((element, index) => searchOperator[index] == element).reduce((acc, curr) => (acc && curr))) {
                minIndex = midIndex;
                break;
            }

            // Adjust search bounds based on comparison
            // Compare layer first, then exponent if layers are equal
            if (operatorArray[midIndex][0] < searchOperator[0] ||
                (searchOperator[0] == operatorArray[midIndex][0] && operatorArray[midIndex][1] < searchOperator[1])) {
                minIndex = midIndex; // Search in upper half
            }

            if (operatorArray[midIndex][0] > searchOperator[0] ||
                (searchOperator[0] == operatorArray[midIndex][0] && operatorArray[midIndex][1] > searchOperator[1])) {
                maxIndex = midIndex; // Search in lower half
            }
        }

        // Return exact index if found, otherwise return a decimal value indicating insertion position
        return (operatorArray[minIndex][1] == searchOperator[1] && operatorArray[minIndex][0] == searchOperator[0])
            ? minIndex
            : minIndex + 0.5;
    }
    
    /**
     * Gets or sets the operator value for a given index.
     * 
     * This method has dual functionality:
     * 1. If called with just the operator coordinates, it returns the current value at that position
     * 2. If called with both coordinates and a value, it sets the value at that position
     * 
     * @param operatorCoordinates The coordinates of the operator in the form [layer, exponent].
     * @param value The value to set for the operator (optional).
     * @returns The current operator value if no value is provided, or void if a value is set.
     */
    public operator(operatorCoordinates: [number, number]): number;
    public operator(operatorCoordinates: [number, number], value: number): void;
    public operator(operatorCoordinates: [number, number], value?: number) {
        // Find where this operator is (or should be) in the array
        let operatorIndex = this.getOperatorIndex(operatorCoordinates);

        // Getter mode: return the current value
        if (value === undefined) {
            if (Number.isInteger(operatorIndex)) {
                // Operator exists in the array, return its value
                return this.array[operatorIndex][2];
            } else {
                // Operator doesn't exist, return default value
                // Special case: if requesting the base value [0,0], return 10 as default
                return operatorCoordinates[0] === 0 && operatorCoordinates[1] === 0 ? 10 : 0;
            }
        }

        // Setter mode: set the value
        if (Number.isInteger(operatorIndex)) {
            // Operator exists, update its value
            this.array[operatorIndex][2] = value;
        }
        else {
            // Operator doesn't exist, insert it at the appropriate position
            operatorIndex = Math.ceil(operatorIndex);
            try {
                // Create a new operator triplet [layer, exponent, value]
                this.array.splice(operatorIndex, 0, [...operatorCoordinates, value]);
            }
            catch {
                // If insertion fails, throw the coordinates for debugging
                throw operatorCoordinates;
            }
        }
        // Ensure the number representation remains in canonical form
        this.normalize();
    }

    /**
     * Rounds this MegotaNumber down to the nearest integer.
     * 
     * Note that this function simply clones numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
     * 
     * @returns A new MegotaNumber representing the rounded down value.
     */
    public floor(): MegotaNumber {
        if (this.isInteger())
            return this.clone();
        return MegotaNumber.fromNumber(Math.floor(this.toNumber()));
    }

    /**
     * Rounds this MegotaNumber up to the nearest integer.
     * 
     * Note that this function simply clones numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
     * 
     * @returns A new MegotaNumber representing the rounded up value.
     */
    public ceil(): MegotaNumber {
        if (this.isInteger())
            return this.clone();
        return MegotaNumber.fromNumber(Math.ceil(this.toNumber()));
    }

    /**
     * Rounds this MegotaNumber to the nearest integer.
     * 
     * Note that this function simply clones numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
     * 
     * @returns A new MegotaNumber representing the rounded value.
     */
    public round(): MegotaNumber {
        if (this.isInteger())
            return this.clone();
        return MegotaNumber.fromNumber(Math.round(this.toNumber()));
    }
}