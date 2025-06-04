import getOperatorIndex from "./getOperatorIndex";


/**
 * Gets the operator value for a given index.
 * 
 * @param megotaNumber The {@link BaseMegota} instance to operate on.
 * @param operatorCoordinates The coordinates of the operator in the form [layer, exponent].
 * @returns The current operator value at the specified coordinates, or a default value if not found.
 */
function gop(megotaNumber: BaseMegota, operatorCoordinates: Operator): number {
    // Find where this operator is (or should be) in the array
    const operatorIndex = getOperatorIndex(megotaNumber, operatorCoordinates);
    if (Number.isInteger(operatorIndex)) {
        // Operator exists in the array, return its value
        return megotaNumber.array[operatorIndex][2];
    } else {
        // Operator doesn't exist, return default value
        // Special case: if requesting the base value [0,0], return 10 as default
        return operatorCoordinates[0] === 0 && operatorCoordinates[1] === 0 ? 10 : 0;
    }
}

export default gop;