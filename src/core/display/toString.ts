import gop from "../operator/gop";
import abs from "../unary/abs";
import isInfinite from "../unary/isInfinite";
import isNaN from "../unary/isNaN";


/**
 * Converts this MegotaNumber to a string representation.
 * 
 * @returns A string representation of this MegotaNumber.
 */
function toString(value: BaseMegota): string {
    if (value.sign === -1) {
        abs(value);
        return "-" + toString(value);
    }

    if (isNaN(value))
        return "NaN";

    if (isInfinite(value)) // only positive infinity is possible here
        return "Infinity";

    let s = "";
    if (!value.layer) s += "";
    else if (value.layer < 3) s += "N".repeat(value.layer);
    else s += "N^" + value.layer + " ";
    if (value.array.length >= 3 || value.array.length === 2 && (value.array[1][0] > 0 || value.array[1][1] >= 2)) {
        for (let i = value.array.length - 1; i >= 2; --i) {
            const e = value.array[i];
            const q = (e[0] > 0 || e[1] >= 5) ? `{${e[0] ? `${e[0]},` : ""}${e[1]}}` : `^`.repeat(e[1]);
            if (e[2] < 5) s += `10${q}`.repeat(e[2]);
            else s += "(10" + q + ")^" + e[2] + " ";
        }
    }
    const op0 = gop(value, [0, 0]);
    const op1 = gop(value, [0, 1]);
    if (op1 > 8) {
        s += "(10^)^" + op1 + " " + op0;
    }
    else if (op1 > 3) {
        s += "e".repeat(op1) + op0;
    }
    else if (op1 > 0) {
        s += "e".repeat(op1 - 1) + Math.pow(10, op0 - Math.floor(op0)) + "e" + Math.floor(op0);
    }
    else { // less than 2^53
        if (op0 < 1e12) { // just display the number
            s += op0.toString();
        }
        else { // scientific notation
            s += op0.toExponential(2);
        }
    }

    return s;
}

export default toString;