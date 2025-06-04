import clone from "../clone";
import div from "../multiplicative/div";
import log10 from "./log10";

/**
 * Calculates the logarithm of this number with respect to a specified base.
 * 
 * @param value The number to calculate the logarithm of, represented as a {@link BaseMegota}.
 * @param base The base for the logarithm, represented as a {@link BaseMegota}.
 */
function log(value: BaseMegota, base: BaseMegota): void {
    log10(value);
    const loggedBase = clone(base);
    log10(loggedBase);
    div(value, loggedBase);
    return;
}

export default log;