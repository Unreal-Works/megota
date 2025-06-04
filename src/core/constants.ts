import fromNumber from "./parsing/fromNumber";
import fromString from "./parsing/fromString";

export class PrimitiveConstants {
    public static readonly MAX_SAFE_INTEGER: number = 9007199254740991; // 2^53 - 1
    public static readonly MIN_SAFE_INTEGER: number = -9007199254740991; // -(2^53 - 1)
    public static readonly MAX_E: number = Math.log10(this.MAX_SAFE_INTEGER);
    public static readonly E_MAX_SAFE_INTEGER: string = "e" + this.MAX_SAFE_INTEGER;
    public static readonly EE_MAX_SAFE_INTEGER: string = "ee" + this.MAX_SAFE_INTEGER;
    public static readonly TETRATED_MAX_SAFE_INTEGER: string = "10^^" + this.MAX_SAFE_INTEGER;
    public static readonly PENTATED_MAX_SAFE_INTEGER: string = "10^^^" + this.MAX_SAFE_INTEGER;
    public static readonly GRAHAMS_NUMBER: string = "J^63 10^^^(10^)^7625597484984 3638334640023.7783";
    public static readonly GENERAL: string = "N10";
}

export class MegotaConstants {
    public static readonly ZERO: BaseMegota = fromNumber(0);
    public static readonly ONE: BaseMegota = fromNumber(1);
    public static readonly TWO: BaseMegota = fromNumber(2);
    public static readonly THREE: BaseMegota = fromNumber(3);
    public static readonly FOUR: BaseMegota = fromNumber(4);
    public static readonly TEN: BaseMegota = fromNumber(10);
    public static readonly E: BaseMegota = fromNumber(Math.E);
    public static readonly LN2: BaseMegota = fromNumber(Math.LN2);
    public static readonly LN10: BaseMegota = fromNumber(Math.LN10);
    public static readonly LOG2E: BaseMegota = fromNumber(Math.LOG2E);
    public static readonly LOG10E: BaseMegota = fromNumber(Math.LOG10E);
    public static readonly PI: BaseMegota = fromNumber(Math.PI);
    public static readonly SQRT1_2: BaseMegota = fromNumber(Math.SQRT1_2);
    public static readonly SQRT2: BaseMegota = fromNumber(Math.SQRT2);
    public static readonly MAX_SAFE_INTEGER: BaseMegota = fromNumber(PrimitiveConstants.MAX_SAFE_INTEGER);
    public static readonly MIN_SAFE_INTEGER: BaseMegota = fromNumber(PrimitiveConstants.MIN_SAFE_INTEGER);
    public static readonly MAX_E: BaseMegota = fromNumber(PrimitiveConstants.MAX_E);
    public static readonly NaN: BaseMegota = fromNumber(Number.NaN);
    public static readonly NEGATIVE_INFINITY: BaseMegota = fromNumber(Number.NEGATIVE_INFINITY);
    public static readonly POSITIVE_INFINITY: BaseMegota = fromNumber(Number.POSITIVE_INFINITY);
    public static readonly E_MAX_SAFE_INTEGER: BaseMegota = fromString(PrimitiveConstants.E_MAX_SAFE_INTEGER);
    public static readonly EE_MAX_SAFE_INTEGER: BaseMegota = fromString(PrimitiveConstants.EE_MAX_SAFE_INTEGER);
    public static readonly TETRATED_MAX_SAFE_INTEGER: BaseMegota = fromString(PrimitiveConstants.TETRATED_MAX_SAFE_INTEGER);
    public static readonly PENTATED_MAX_SAFE_INTEGER: BaseMegota = fromString(PrimitiveConstants.PENTATED_MAX_SAFE_INTEGER);
    public static readonly GRAHAMS_NUMBER: BaseMegota = fromString(PrimitiveConstants.GRAHAMS_NUMBER);
    public static readonly GENERAL: BaseMegota = fromString(PrimitiveConstants.GENERAL);

    public static readonly RECIP_MAX: BaseMegota = fromString("2e323");
    public static readonly NEGATIVE_E_RECIP: BaseMegota = fromNumber(-1 / Math.E);
    public static readonly EXP_E_RECIP: BaseMegota = fromNumber(Math.exp(1 / Math.E));
    public static readonly EXP_NEGATIVE_E_RECIP: BaseMegota = fromNumber(Math.exp(-1 / Math.E));
    public static readonly NEGATIVE_ONE: BaseMegota = fromNumber(-1);
    public static readonly NEGATIVE_TWO: BaseMegota = fromNumber(-2);
}