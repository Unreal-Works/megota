import add from "../additive/add";
import clone from "../clone";
import paste from "../paste";
import slog from "./slog";
import tetrate from "./tetrate";

/**
 * Addition in tetrational space. This is **NOT** the same as normal addition.
 * 
 * Equivalent to `base.tetrate(this.slog(base) + other)`.
 * 
 * @param value The number to which the other number will be added.
 * @param other The number to add. 
 * @param base The base for tetration.
 */
function tetrateAdd(value: BaseMegota, other: BaseMegota, base: BaseMegota): void {
    slog(value, base);
    add(value, other);
    base = clone(base);
    tetrate(base, value);
    return paste(value, base);
};

export default tetrateAdd;