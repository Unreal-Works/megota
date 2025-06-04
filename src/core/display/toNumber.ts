
/**
 * Converts this MegotaNumber to a JavaScript number.
 * 
 * If the number is beyond {@link Number.MAX_SAFE_INTEGER}, it will return `Infinity`.
 * 
 * @param value The number represented as a {@link BaseMegota} to convert.
 * @returns A number representation of this MegotaNumber.
 */
function toNumber(value: BaseMegota): number {
    if (value.array.length >= 2) {
        const height = value.array[1][2]; // 10^10^... height
        if (height > 1) {
            return value.sign * Infinity;
        }
        else if (height === 1) {
            return value.sign * Math.pow(10, value.array[0][2]);
        }
    }
    return value.sign * value.array[0][2];
};

export default toNumber;