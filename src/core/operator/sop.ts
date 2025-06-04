import normalize from "../normalize";
import getOperatorIndex from "./getOperatorIndex";

/**
 * Sets the operator value for a given index.
 * 
 * @param megotaNumber The {@link BaseMegota} instance to operate on.
 * @param operatorCoordinates The coordinates of the operator in the form [layer, exponent].
 * @param value The value to set for the operator (optional).
 */
function sop(megotaNumber: BaseMegota, operatorCoordinates: Operator, value: number): void {
    // Find where this operator is (or should be) in the array
    let operatorIndex = getOperatorIndex(megotaNumber, operatorCoordinates);

    if (Number.isInteger(operatorIndex)) {
        // Operator exists, update its value
        megotaNumber.array[operatorIndex][2] = value;
    }
    else {
        // Operator doesn't exist, insert it at the appropriate position
        operatorIndex = Math.ceil(operatorIndex);
        megotaNumber.array.splice(operatorIndex, 0, [...operatorCoordinates, value]);
    }
    // Ensure the number representation remains in canonical form
    normalize(megotaNumber);
}

export default sop;