import { MegotaConstants } from "../constants";
import root from "./root";

/**
 * Calculates the square root of this number.
 * 
 * @param value The number to calculate the square root of, represented as a {@link BaseMegota}.
 */
function sqrt(value: BaseMegota): void {
    return root(value, MegotaConstants.TWO);
};

export default sqrt;