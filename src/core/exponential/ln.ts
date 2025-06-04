import { MegotaConstants } from "../constants";
import log from "./log";

/**
 * Calculates the natural logarithm (base e) of this MegotaNumber.
 * 
 * @param value The MegotaNumber to calculate the natural logarithm of, represented as a {@link BaseMegota}.
 */
function ln(value: BaseMegota): void {
    return log(value, MegotaConstants.E);
};

export default ln;