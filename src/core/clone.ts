/**
 * Creates a deep clone of the current MegotaNumber instance.
 * 
 * This method creates a new MegotaNumber object with the same properties as the original,
 * ensuring that all nested objects are also copied (deep copy) rather than referenced.
 * This prevents unintended modifications to the original object when the clone is modified.
 * 
 * @returns A new MegotaNumber instance that is a complete independent copy of the current instance.
 */
function clone(value: BaseMegota): BaseMegota {
    // Create a deep copy of the array representation
    const clonedArray = [];
    for (let index = 0; index < value.array.length; ++index) {
        // Use spread operator to create a new array for each triplet
        // This ensures we have a true deep copy of each [layer, operation, value] triplet
        clonedArray.push([...value.array[index]]);
    }

    return {
        array: clonedArray,
        sign: value.sign,
        layer: value.layer
    };
};

export default clone;