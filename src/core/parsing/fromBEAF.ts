import clone from "../clone";
import { MegotaConstants } from "../constants";
import pow from "../exponential/pow";
import arrow from "../hyper/arrow";
import fromNumber from "./fromNumber";

/**
 * Creates a MegotaNumber from a [Bower's Exploding Array Function](https://googology.fandom.com/wiki/Bowers%27_Exploding_Array_Function) (BEAF) array.
 * 
 * [a, b, c, d]  = a {c}^d b, where d is the number of sets of braces.
 * 
 * @param beaf The BEAF array to convert into a BaseMegota.
 * @returns A BaseMegota instance representing the input array.
 */
function fromBEAF(beaf: Array<number>): BaseMegota {
    const length = beaf.length;
    if (length === 0)
        return clone(MegotaConstants.ZERO);

    const a = beaf[0];
    if (length === 1) // {a} = a
        return fromNumber(a);

    const b = beaf[1];
    if (b === 1) // {a, 1, ...} = a
        return fromNumber(a);

    if (length === 2) { // {a, b} = a^b
        const base = fromNumber(a);
        pow(base, fromNumber(b));
        return base;
    }

    const c = beaf[2];
    if (length === 3) { // {a, b, c} = a{c}b
        const base = fromNumber(a);
        arrow(base, fromNumber(c), fromNumber(b));
        return base;
    }

    if (length > 4) {
        throw new Error("This function currently only supports arrays of length 4 or less.");
    }

    // TODO
    return clone(MegotaConstants.ZERO);
};

export default fromBEAF;