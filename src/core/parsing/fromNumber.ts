import normalize from "../normalize";

/**
 * Creates a {@link BaseMegota} from a number.
 * 
 * @param input The number to convert into a BaseMegota.
 * @param object An optional object to populate with the result.
 * @returns A BaseMegota representation of the input number.
 */
function fromNumber(input: number, object?: BaseMegota): BaseMegota {
    const sign = input < 0 ? -1 : 1;
    const array = [[0, 0, Math.abs(input)]];
    if (object) {
        object.sign = sign;
        object.array = array;
        object.layer = 0;
        return normalize(object);
    }

    return normalize({
        sign,
        array,
        layer: 0
    });
};

export default fromNumber;