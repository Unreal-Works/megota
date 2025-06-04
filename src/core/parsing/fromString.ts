import { PrimitiveConstants } from "../constants";
import normalize from "../normalize";
import getOperatorIndex from "../operator/getOperatorIndex";
import gop from "../operator/gop";
import fromJSON from "./fromJSON";

// Pattern for validating MegotaNum string format
const isMegotaNum = /^[-+]*(Infinity|NaN|(N+|N\^\d+ )?(10(\^+|\{(?!0,0)(\d*,)?\d*\})|\(10(\^+|\{(?!0,0)(\d*,)?\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;
const LONG_STRING_MIN_LENGTH = 17;

/**
 * Calculates the base-10 logarithm of extremely large numbers represented as strings.
 * 
 * @param str Representation of a very large number
 * @returns The approximate base-10 logarithm of the number
 */
function log10LongString(str: string) {
    const significantPart = str.substring(0, LONG_STRING_MIN_LENGTH);
    const remainingLength = str.length - LONG_STRING_MIN_LENGTH;
    
    return Math.log10(Number(significantPart)) + remainingLength;
}

/**
 * Converts a string representation of a number into a MegotaNumber object.
 * 
 * @param input String representation of a number to convert
 * @returns A MegotaNumber representing the input string
 */
function fromString(input: string): BaseMegota {
    // Handle JSON input
    if (isJsonInput(input)) {
        return fromJSON(input);
    }

    // Initialize result object
    const result: BaseMegota = {
        array: [[0, 0, 0]],
        sign: 1,
        layer: 0,
    };
    
    // Store original input for error messages
    const originalInput = input;
    
    // Replace shorthand notation
    input = input.replaceAll("J^", "(10{1,0})^").replaceAll("J", "10{1,0}");

    // Validate input format
    if (!isMegotaNum.test(input)) {
        console.warn("Malformed input: " + originalInput);
        result.array = [[0, 0, NaN]];
        return result;
    }

    // Handle sign characters
    const negateResult = processSignCharacters(input);
    if (negateResult.hasSign) {
        input = negateResult.remainingInput;
        result.sign = negateResult.isNegative ? -1 : 1;
    }

    // Handle special values
    if (input === "NaN") {
        result.array = [[0, 0, NaN]];
        return result;
    } 
    else if (input === "Infinity") {
        result.array = [[0, 0, Infinity]];
        return result;
    }

    // Process layer notation (N prefix)
    const layerResult = processLayerNotation(input);
    result.layer = layerResult.layer;
    input = layerResult.remainingInput;

    // Process arrow/bracket expressions
    while (input && /^\(?10[\^{]/.test(input)) {
        const arrowResult = processArrowNotation(input, result);
        input = arrowResult.remainingInput;
    }

    // Process scientific notation
    processScientificNotation(input, result);

    return normalize(result);
}

/**
 * Checks if the input string is a JSON format
 */
function isJsonInput(input: string): boolean {
    if (input[0] === "[" || input[0] === "{") {
        try {
            JSON.parse(input);
            return true;
        } catch {
            return true; // Still treat as JSON even if parsing fails
        }
    }
    return false;
}

/**
 * Process sign characters at the beginning of the input
 */
function processSignCharacters(input: string): { hasSign: boolean, isNegative: boolean, remainingInput: string } {
    if (input[0] !== '-' && input[0] !== '+') {
        return { hasSign: false, isNegative: false, remainingInput: input };
    }
    
    const numSigns = input.search(/[^-+]/);
    const signs = input.substring(0, numSigns);
    const minusCount = signs.match(/-/g)?.length || 0;
    const isNegative = minusCount % 2 === 1;
    
    return {
        hasSign: true,
        isNegative,
        remainingInput: input.substring(numSigns)
    };
}

/**
 * Process layer notation (N prefix)
 */
function processLayerNotation(input: string): { layer: number, remainingInput: string } {
    if (input[0] !== 'N') {
        return { layer: 0, remainingInput: input };
    }
    
    if (input[1] === '^') {
        const endPos = input.substring(2).search(/[^0-9]/) + 2;
        const layer = Number(input.substring(2, endPos));
        return { layer, remainingInput: input.substring(endPos + 1) };
    } else {
        const endPos = input.search(/[^N]/);
        const layer = endPos; // Count of consecutive 'N's
        return { layer, remainingInput: input.substring(endPos) };
    }
}

/**
 * Process arrow notation in the input
 */
function processArrowNotation(input: string, result: BaseMegota): { remainingInput: string } {
    let currentPos = 0;
    
    // Skip opening parenthesis if present
    if (input[0] === "(") {
        currentPos = 1;
    }
    
    // Parse arrow notation
    let arrows: Array<number>;
    let nextPos: number;
    
    if (input[currentPos + 2] === "^") {
        const arrowCount = input.substring(currentPos + 2).search(/[^^]/);
        arrows = [0, arrowCount];
        nextPos = currentPos + 2 + arrowCount;
    } else {
        const closeBracketPos = input.indexOf("}");
        const arrowParts = input.substring(currentPos + 3, closeBracketPos).split(",").map(e => parseInt(e));
        arrows = arrowParts.length === 1 ? [0, arrowParts[0]] : arrowParts;
        nextPos = closeBracketPos + 1;
    }
    
    // Move position after arrow notation
    input = input.substring(nextPos);
    
    // Handle exponent if present
    let exponent = 1;
    if (input[0] === ")") {
        const spacePos = input.indexOf(" ");
        exponent = Number(input.substring(2, spacePos));
        input = input.substring(spacePos + 1);
    }
    
    // Apply the arrow notation to the result
    applyArrowNotation(result, arrows as Operator, exponent);
    
    return { remainingInput: input };
}

/**
 * Apply arrow notation effects to the result
 */
function applyArrowNotation(result: BaseMegota, arrows: Operator, exponent: number): void {
    if (arrows[0] === 0 && arrows[1] === 1) {
        // Handle tetration
        if (result.array.length >= 2 && result.array[1][0] === 0 && result.array[1][1] === 1) {
            result.array[1][2] += exponent;
        } else {
            result.array.splice(1, 0, [0, 1, exponent]);
        }
    } else if (arrows[0] === 0 && arrows[1] === 2) {
        // Handle pentation
        const tetrationValue = result.array.length >= 2 && 
            (result.array[1][0] === 0 && result.array[1][1] === 1) ? result.array[1][2] : 0;
            
        let newValue = tetrationValue;
        const baseValue = result.array[0][2];
        
        if (baseValue >= 1e10) ++newValue;
        if (baseValue >= 10) ++newValue;
        
        result.array[0][2] = newValue;
        
        if (result.array.length >= 2 && result.array[1][0] === 0 && result.array[1][1] === 1) {
            result.array.splice(1, 1);
        }
        
        const operatorIndex = getOperatorIndex(result, [0, 2]);
        if (Number.isInteger(operatorIndex)) {
            result.array[operatorIndex][2] += exponent;
        } else {
            result.array.splice(Math.ceil(operatorIndex), 0, [0, 2, exponent]);
        }
    } else {
        // Handle higher arrow notation
        const a = gop(result, [arrows[0], arrows[1] - 1]);
        const b = gop(result, [arrows[0], arrows[1] - 2]);
        
        let newValue = a;
        if (b >= 10) ++newValue;
        
        const operatorIndex = getOperatorIndex(result, arrows as Operator);
        result.array.splice(1, Math.ceil(operatorIndex) - 1);
        result.array[0][2] = newValue;
        
        if (Number.isInteger(operatorIndex)) {
            result.array[1][2] += exponent;
        } else {
            result.array.splice(1, 0, [...arrows, exponent]);
        }
    }
}

/**
 * Process scientific notation in the input
 */
function processScientificNotation(input: string, result: BaseMegota): void {
    const parts = input.split(/[Ee]/);
    const value = [result.array[0][2], 0]; // [value, exponent tier]
    const multiplyFactor = 1;
    
    for (let i = parts.length - 1; i >= 0; --i) {
        // Handle existing value
        processExistingValue(value, multiplyFactor);
        
        // Process coefficient from current part
        if (parts[i]) {
            processCoefficient(value, parts[i]);
        }
        
        // Carry if needed
        performCarrying(value);
    }
    
    // Apply final value to result
    result.array[0][2] = value[0];
    
    if (value[1]) {
        if (result.array.length >= 2 && result.array[1][0] === 0 && result.array[1][1] === 1) {
            result.array[1][2] += value[1];
        } else {
            result.array.splice(1, 0, [0, 1, value[1]]);
        }
    }
}

/**
 * Process the existing value in scientific notation calculation
 */
function processExistingValue(value: number[], multiplyFactor: number): void {
    if (value[0] < PrimitiveConstants.MAX_E && value[1] === 0) {
        value[0] = Math.pow(10, multiplyFactor * value[0]);
    } else if (multiplyFactor === -1) {
        if (value[1] === 0) {
            value[0] = Math.pow(10, multiplyFactor * value[0]);
        } else if (value[1] === 1 && value[0] <= Math.log10(Number.MAX_VALUE)) {
            value[0] = Math.pow(10, multiplyFactor * Math.pow(10, value[0]));
        } else {
            value[0] = 0;
        }
        value[1] = 0;
    } else {
        value[1]++;
    }
}

/**
 * Process coefficient in scientific notation
 */
function processCoefficient(value: number[], part: string): void {
    const decimalPointPos = part.indexOf(".");
    const intPartLen = decimalPointPos === -1 ? part.length : decimalPointPos;
    
    if (value[1] === 0) {
        if (intPartLen >= LONG_STRING_MIN_LENGTH) {
            value[0] = Math.log10(value[0]) + log10LongString(part.substring(0, intPartLen));
            value[1] = 1;
        } else {
            value[0] *= Number(part);
        }
    } else {
        const logValue = intPartLen >= LONG_STRING_MIN_LENGTH 
            ? log10LongString(part.substring(0, intPartLen)) 
            : part ? Math.log10(Number(part)) : 0;
            
        if (value[1] === 1) {
            value[0] += logValue;
        } else if (value[1] === 2 && value[0] < PrimitiveConstants.MAX_E + Math.log10(logValue)) {
            value[0] += Math.log10(1 + Math.pow(10, Math.log10(logValue) - value[0]));
        }
    }
}

/**
 * Perform carrying in scientific notation calculation
 */
function performCarrying(value: number[]): void {
    if (value[0] < PrimitiveConstants.MAX_E && value[1]) {
        value[0] = Math.pow(10, value[0]);
        value[1]--;
    } else if (value[0] > PrimitiveConstants.MAX_SAFE_INTEGER) {
        value[0] = Math.log10(value[0]);
        value[1]++;
    }
}

export default fromString;