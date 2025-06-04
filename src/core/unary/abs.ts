/**
 * Converts the given number to its absolute value (the value without regard to whether it is positive or negative).
 * 
 * @param value The MegotaNumber to convert to its absolute value.
 */
function abs(value: BaseMegota): void {
    value.sign = 1;
}

export default abs;