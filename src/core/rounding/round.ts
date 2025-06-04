import toNumber from "../display/toNumber";
import fromNumber from "../parsing/fromNumber";
import isInteger from "../unary/isInteger";

/**
 * Rounds this number to the nearest integer.
 * 
 * Note that this function simply ignores numbers beyond {@link MegotaNumber.MAX_SAFE_INTEGER}.
 * 
 * @param value The number to round, represented as a {@link BaseMegota}.
 */
function round(value: BaseMegota): void {
    if (isInteger(value))
        return;
    fromNumber(Math.round(toNumber(value)), value);
};

export default round;