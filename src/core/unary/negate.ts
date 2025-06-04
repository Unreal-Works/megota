/**
 * Negates the value of the number (the value with the opposite sign).
 * 
 * @param value The number represented as a {@link BaseMegota} to negate.
 */
function negate(value: BaseMegota) {
    value.sign *= -1;
}

export default negate;