import normalize from "../normalize";
import getOperatorIndex from "./getOperatorIndex";
import gop from "./gop";

/**
 * Increments the operator value for a given index.
 * 
 * @param megotaNumber The {@link BaseMegota} instance to operate on.
 * @param operatorCoordinates The coordinates of the operator in the form [layer, exponent].
 * @param delta The amount to increment for the operator.
 */
function iop(megotaNumber: BaseMegota, operatorCoordinates: Operator, delta: number): void {
    // Skip the operation if delta is 0
    if (delta === 0) return;

    // Find where this operator is (or should be) in the array
    const operatorIndex = getOperatorIndex(megotaNumber, operatorCoordinates);

    if (Number.isInteger(operatorIndex)) {
        // Operator exists, increment its value directly
        megotaNumber.array[operatorIndex][2] += delta;
    } else {
        // Operator doesn't exist, get current default value and insert with increment
        const currentValue = gop(megotaNumber, operatorCoordinates);
        const newValue = currentValue + delta;

        // Only insert if the resulting value would be different from the default
        if (newValue !== (operatorCoordinates[0] === 0 && operatorCoordinates[1] === 0 ? 10 : 0)) {
            const insertIndex = Math.ceil(operatorIndex);
            megotaNumber.array.splice(insertIndex, 0, [...operatorCoordinates, newValue]);
        }
    }

    // Ensure the number representation remains in canonical form
    normalize(megotaNumber);
}

export default iop;