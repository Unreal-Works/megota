import normalize from "../normalize";

/**
* Creates a {@link BaseMegota} from an array of numbers in OmegaNum.js format.
* 
* OmegaNum.js represents large numbers as an array where each entry is a coefficient
* for a specific operation level. This method maps those entries to BaseMegota's
* internal representation.
* 
* @see https://github.com/Naruyoko/OmegaNum.js
* 
* @param omegaArray The OmegaNum.js array to convert into a BaseMegota.
* @returns A BaseMegota instance representing the input array.
*/
export default (omegaArray: Array<number>): BaseMegota => {
    const array = new Array<Array<number>>();
    // In OmegaNum format, each position represents a different operation level
    for (let operationLevel = 0; operationLevel < omegaArray.length; operationLevel++) {
        // Create a triplet [layer, operator, value] for each entry
        // OmegaNum uses fixed layer 0 with varying operation levels
        array.push([0, operationLevel, omegaArray[operationLevel]]);
    }

    return normalize({
        array: array,
        sign: 1,
        layer: 0
    });
};