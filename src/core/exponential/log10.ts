import equals from "../comparison/equals";
import greaterThan from "../comparison/greaterThan";
import lessThan from "../comparison/lessThan";
import lessThanOrEquals from "../comparison/lessThanOrEquals";
import { MegotaConstants } from "../constants";
import toNumber from "../display/toNumber";
import normalize from "../normalize";
import iop from "../operator/iop";
import fromNumber from "../parsing/fromNumber";
import paste from "../paste";
import isInfinite from "../unary/isInfinite";

/**
 * Calculates the logarithm base 10 of the given {@link BaseMegota}.
 * 
 * @param value The number to calculate the logarithm for, represented as a {@link BaseMegota}.
 */
function log10(value: BaseMegota): void {
    if (lessThan(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NaN);

    if (equals(value, MegotaConstants.ZERO))
        return paste(value, MegotaConstants.NEGATIVE_INFINITY);

    if (lessThanOrEquals(value, MegotaConstants.MAX_SAFE_INTEGER)) {
        fromNumber(Math.log10(toNumber(value)), value);
        return;
    }

    if (isInfinite(value))
        return;

    if (greaterThan(value, MegotaConstants.TETRATED_MAX_SAFE_INTEGER))
        return;

    iop(value, [0, 1], -1);
    normalize(value);
    return;
};

export default log10;