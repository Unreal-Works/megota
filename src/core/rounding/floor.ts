import toNumber from "../display/toNumber";
import fromNumber from "../parsing/fromNumber";
import isInteger from "../unary/isInteger";

/**
 * Rounds this number down to the nearest integer.
 * 
 * Note that this function simply ignores numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
 * 
 * @param value The number to round down, represented as a {@link BaseMegota}.
 */
function floor(value: BaseMegota): void {
    if (isInteger(value))
        return;
    fromNumber(Math.floor(toNumber(value)), value);
};

export default floor;