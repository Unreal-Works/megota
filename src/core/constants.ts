import fromNumber from "./parsing/fromNumber";
import fromString from "./parsing/fromString";

export class PrimitiveConstants {
    public static readonly MAX_SAFE_INTEGER = 9007199254740991; // 2^53 - 1
    public static readonly MIN_SAFE_INTEGER = -9007199254740991; // -(2^53 - 1)
    public static readonly MAX_E = Math.log10(this.MAX_SAFE_INTEGER);
    public static readonly E_MAX_SAFE_INTEGER = "e" + this.MAX_SAFE_INTEGER;
    public static readonly EE_MAX_SAFE_INTEGER = "ee" + this.MAX_SAFE_INTEGER;
    public static readonly TETRATED_MAX_SAFE_INTEGER = "10^^" + this.MAX_SAFE_INTEGER;
    public static readonly PENTATED_MAX_SAFE_INTEGER = "10^^^" + this.MAX_SAFE_INTEGER;
    public static readonly GRAHAMS_NUMBER = "J^63 10^^^(10^)^7625597484984 3638334640023.7783";
    public static readonly GENERAL = "N10";
}

export class MegotaConstants {
    public static readonly ZERO = fromNumber(0);
    public static readonly ONE = fromNumber(1);
    public static readonly TWO = fromNumber(2);
    public static readonly THREE = fromNumber(3);
    public static readonly FOUR = fromNumber(4);
    public static readonly TEN = fromNumber(10);
    public static readonly E = fromNumber(Math.E);
    public static readonly LN2 = fromNumber(Math.LN2);
    public static readonly LN10 = fromNumber(Math.LN10);
    public static readonly LOG2E = fromNumber(Math.LOG2E);
    public static readonly LOG10E = fromNumber(Math.LOG10E);
    public static readonly PI = fromNumber(Math.PI);
    public static readonly SQRT1_2 = fromNumber(Math.SQRT1_2);
    public static readonly SQRT2 = fromNumber(Math.SQRT2);
    public static readonly MAX_SAFE_INTEGER = fromNumber(PrimitiveConstants.MAX_SAFE_INTEGER);
    public static readonly MIN_SAFE_INTEGER = fromNumber(PrimitiveConstants.MIN_SAFE_INTEGER);
    public static readonly MAX_E = fromNumber(PrimitiveConstants.MAX_E);
    public static readonly NaN = fromNumber(Number.NaN);
    public static readonly NEGATIVE_INFINITY = fromNumber(Number.NEGATIVE_INFINITY);
    public static readonly POSITIVE_INFINITY = fromNumber(Number.POSITIVE_INFINITY);
    public static readonly E_MAX_SAFE_INTEGER = fromString(PrimitiveConstants.E_MAX_SAFE_INTEGER);
    public static readonly EE_MAX_SAFE_INTEGER = fromString(PrimitiveConstants.EE_MAX_SAFE_INTEGER);
    public static readonly TETRATED_MAX_SAFE_INTEGER = fromString(PrimitiveConstants.TETRATED_MAX_SAFE_INTEGER);
    public static readonly PENTATED_MAX_SAFE_INTEGER = fromString(PrimitiveConstants.PENTATED_MAX_SAFE_INTEGER);
    public static readonly GRAHAMS_NUMBER = fromString(PrimitiveConstants.GRAHAMS_NUMBER);
    public static readonly GENERAL = fromString(PrimitiveConstants.GENERAL);

    public static readonly RECIP_MAX = fromString("2e323");
    public static readonly NEGATIVE_E_RECIP = fromNumber(-1 / Math.E);
    public static readonly EXP_E_RECIP = fromNumber(Math.exp(1 / Math.E));
    public static readonly EXP_NEGATIVE_E_RECIP = fromNumber(Math.exp(-1 / Math.E));
    public static readonly NEGATIVE_ONE = fromNumber(-1);
    public static readonly NEGATIVE_TWO = fromNumber(-2);
}