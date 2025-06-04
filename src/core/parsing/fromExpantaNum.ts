import normalize from "../normalize";

/**
 * Creates a BaseMegota from an array of arrays in ExpantaNum.js format.
 * 
 * ExpantaNum.js represents large numbers as an array of [operation, value] pairs.
 * This method maps those pairs to BaseMegota's internal representation.
 * 
 * @see https://github.com/Naruyoko/ExpantaNum.js
 * 
 * @param expantaArray The ExpantaNum.js array to convert into a BaseMegota.
 * @returns A BaseMegota instance representing the input array.
 */
export default (expantaArray: Array<Array<number>>): BaseMegota => {
    const array = new Array<Array<number>>();

    // Process each entry in the ExpantaNum array
    for (let index = 0; index < expantaArray.length; index++) {
        // ExpantaNum uses format [operation, value]
        // Map to MegotaNumber's [layer, operation, value] format with fixed layer 0
        const operation = expantaArray[index][0];
        const value = expantaArray[index][1];
        array.push([0, operation, value]);
    }

    return normalize({
        array: array,
        sign: 1,
        layer: 0
    });
};