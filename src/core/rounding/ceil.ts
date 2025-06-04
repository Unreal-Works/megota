import toNumber from "../display/toNumber";
import fromNumber from "../parsing/fromNumber";
import isInteger from "../unary/isInteger";


/**
 * Rounds this number up to the nearest integer.
 * 
 * Note that this function simply ignores numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
 * 
 * @param value The number to round down, represented as a {@link BaseMegota}.
 */
function ceil(value: BaseMegota): void {
    if (isInteger(value))
        return;
    fromNumber(Math.ceil(toNumber(value)), value);
};

export default ceil;