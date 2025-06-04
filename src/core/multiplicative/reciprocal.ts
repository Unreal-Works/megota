import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import isNaN from "../unary/isNaN";

/**
 * Calculates the reciprocal of this {@link BaseMegota}.
 * 
 * Equivalent to `1 / this`.
 */
function reciprocal(value: BaseMegota): void {
    if (isNaN(value) || equals(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (greaterThan(value, MegotaConstants.RECIP_MAX, true))
        return paste(value, MegotaConstants.ZERO);

    fromNumber(1 / toNumber(value), value);
    return;
};

export default reciprocal;