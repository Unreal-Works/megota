import { MegotaConstants } from "../constants";
import root from "./root";

/**
 * Calculates the cube root of this {@link BaseMegota}.
 * 
 * @param value The number to calculate the cube root of, represented as a {@link BaseMegota}.
 */
function cbrt(value: BaseMegota): void {
    return root(value, MegotaConstants.THREE);
};

export default cbrt;