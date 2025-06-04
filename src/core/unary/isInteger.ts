import toNumber from "../display/toNumber";

/**
 * Checks if the number is an integer.
 * 
 * Note that all numbers beyond {@link Number.MAX_SAFE_INTEGER} are considered integers.
 * 
 * @returns `true` if the number is an integer, otherwise `false`.
 */
function isInteger(value: BaseMegota): boolean {
    const displayed = toNumber(value);

    if (!Number.isFinite(displayed))
        return true;

    return Number.isInteger(displayed);
};

export default isInteger;