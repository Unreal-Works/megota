import clone from "../clone";
import { MegotaConstants } from "../constants";
import fromOmegaNum from "./fromOmegaNum";

/**
 * Attempts to parse an object into a {@link BaseMegota}.
 * 
 * @param input The input object to parse into a BaseMegota.
 * @returns A BaseMegota instance representing the input object.
 */
function fromObject(input: unknown): BaseMegota {
    if (typeof input != "object")
        throw new TypeError("Expected object, got " + typeof input + ".");

    if (input === null)
        return clone(MegotaConstants.ZERO);

    if (input instanceof Array)
        return fromOmegaNum(input);

    if (!("array" in input) || !("sign" in input) || !("layer" in input))
        throw new TypeError("Expected object with properties 'array', 'sign', and 'layer'.");

    if (!(input.array instanceof Array))
        throw new TypeError("Expected property 'array' to be an Array, got " + typeof input.array + ".");

    if (typeof input.sign != "number")
        throw new TypeError("Expected property 'sign' to be a Number, got " + typeof input.sign + ".");

    if (typeof input.layer != "number")
        throw new TypeError("Expected property 'layer' to be a Number, got " + typeof input.layer + ".");

    return {
        array: input.array ? input.array : [[0, 0, 0]],
        sign: input.sign !== undefined ? (input.sign < 0 ? -1 : 1) : 1,
        layer: input.layer !== undefined ? input.layer : 0
    };
};

export default fromObject;