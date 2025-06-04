import fromObject from "./fromObject";

/**
 * Creates a {@link BaseMegota} from a JSON string.
 * 
 * @param input The JSON string to parse into a BaseMegota.
 * @returns A BaseMegota instance representing the parsed JSON.
 */
function fromJSON(input: string): BaseMegota {
    return fromObject(JSON.parse(input));
};

export default fromJSON;