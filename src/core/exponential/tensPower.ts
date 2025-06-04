import greaterThan from "../comparison/greaterThan";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import normalize from "../normalize";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";

/**
 * Raises 10 to the power of another {@link BaseMegota}.
 * 
 * This method is used for operations involving powers of ten, such as scientific notation.
 * 
 * @param exponent The exponent number. This object will be mutated to reflect the operation.
 */
function tensPower(exponent: BaseMegota): void {
    if (greaterThan(exponent, MegotaConstants.ZERO)) {
        iop(exponent, [0, 1], 1);
        normalize(exponent);
        return;
    }

    fromNumber(Math.pow(10, toNumber(exponent)), exponent);
};

export default tensPower;