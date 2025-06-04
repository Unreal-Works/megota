import { PrimitiveConstants } from "../constants";
import normalize from "../normalize";
import getOperatorIndex from "../operator/getOperatorIndex";
import gop from "../operator/gop";
import fromJSON from "./fromJSON";

const isMegotaNum = /^[-+]*(Infinity|NaN|(N+|N\^\d+ )?(10(\^+|\{(?!0,0)(\d*,)?\d*\})|\(10(\^+|\{(?!0,0)(\d*,)?\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;
const LONG_STRING_MIN_LENGTH = 17;

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
function log10LongString(str: string) {
    return Math.log10(Number(str.substring(0, LONG_STRING_MIN_LENGTH))) + (str.length - LONG_STRING_MIN_LENGTH);
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
 * @param input String representation of a number to convert
 * @returns A MegotaNumber representing the input string
 */
export default (input: string): BaseMegota => {
    let isJSON = false;
    if (input[0] == "[" || input[0] == "{") {
        try {
            JSON.parse(input);
        } finally {
            isJSON = true;
        }
    }
    if (isJSON) {
        return fromJSON(input);
    }

    const x: BaseMegota = {
        array: [[0, 0, 0]],
        sign: 1,
        layer: 0,
    };
    const initial = input;
    input = input.replaceAll("J^", "(10{1,0})^");
    input = input.replaceAll("J", "10{1,0}");

    if (!isMegotaNum.test(input)) {
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
                    d = getOperatorIndex(x, [0, 2]);
                    if (Number.isInteger(d)) x.array[d][2] += c;
                    else x.array.splice(Math.ceil(d), 0, [0, 2, c]);
                } else {
                    a = gop(x, [arrows[0], arrows[1] - 1]);
                    b = gop(x, [arrows[0], arrows[1] - 2]);
                    if (b >= 10) ++a;
                    d = getOperatorIndex(x, arrows as Operator);
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
                if (intPartLen >= LONG_STRING_MIN_LENGTH) {
                    b[0] = Math.log10(b[0]) + log10LongString(a[i].substring(0, intPartLen));
                    b[1] = 1;
                }
                else if (a[i]) {
                    b[0] *= Number(a[i]);
                }
            } else {
                d = intPartLen >= LONG_STRING_MIN_LENGTH ? log10LongString(a[i].substring(0, intPartLen)) : a[i] ? Math.log10(Number(a[i])) : 0;
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

    return normalize(x);
};