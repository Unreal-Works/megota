/**
 * Pastes the properties of one {@link BaseMegota} into another.
 * 
 * This function copies the sign, layer, and array properties from the `pasting` number to the `value` number.
 * 
 * This is faster than using the `clone` function, as it does not create a new object but modifies the existing one.
 * 
 * @param value The number to paste into, represented as a {@link BaseMegota}.
 * @param pasting The number to paste from, represented as a {@link BaseMegota}.
 */
function paste(value: BaseMegota, pasting: BaseMegota): void {
    if (value === pasting)
        return; // Same reference, no need to copy

    value.sign = pasting.sign;
    value.layer = pasting.layer;
    value.array = [];
    for (let i = 0; i < pasting.array.length; ++i) {
        value.array.push([...pasting.array[i]]);
    }
}

export default paste;