import clone from "../clone";
import { MegotaConstants } from "../constants";
import paste from "../paste";
import pow from "./pow";

/**
 * Raises Euler's number (e) to the power of this {@link BaseMegota}.
 * 
 * @param value The exponent to raise e to, represented as a {@link BaseMegota}.
 */
function exp(value: BaseMegota): void {
    const result = clone(MegotaConstants.E);
    pow(result, value);
    paste(value, result);
    return;
};

export default exp;