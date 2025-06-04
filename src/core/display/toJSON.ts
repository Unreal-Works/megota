import { MegotaConfiguration } from "../Configuration";
import toString from "./toString";


/**
 * Converts this number to a JSON representation.
 * 
 * @param value The number represented as a {@link BaseMegota} to convert to JSON.
 * @returns A JSON string or a string representation of the number.
 */
function toJSON(value: BaseMegota): string {
    if (MegotaConfiguration.serializeMode === 1) {
        return toString(value);
    }

    return JSON.stringify({
        array: value.array,
        layer: value.layer,
        sign: value.sign
    });
};

export default toJSON;