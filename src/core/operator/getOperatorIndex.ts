
/**
 * Gets the index of the operator in the array.
 * 
 * This method performs a binary search to find the index of the operator in the sorted array.
 * 
 * If the operator does not exist, a decimal index is returned, indicating where it would be inserted.
 * 
 * @param megotaNumber The {@link BaseMegota} instance containing the operator array.
 * @param searchOperator The operator to find, represented as [layer, exponent].
 * @returns The index of the operator, or a decimal value if not found (indicating insertion position).
 */
function getOperatorIndex(megotaNumber: BaseMegota, searchOperator: Operator): number {
    const operatorArray = megotaNumber.array;
    let minIndex = 0, maxIndex = operatorArray.length - 1;

    while (minIndex != maxIndex) {
        // Check if the operator is at the min or max positions first for quick returns

        // Check if operator at minIndex matches the search operator
        // Extract the first two elements (layer, exponent) and compare with searchOperator
        if (operatorArray[minIndex].slice(0, 2).map((element, index) => searchOperator[index] === element).reduce((acc, curr) => (acc && curr)))
            return minIndex;

        // Check if operator at maxIndex matches the search operator
        if (operatorArray[maxIndex].slice(0, 2).map((element, index) => searchOperator[index] === element).reduce((acc, curr) => (acc && curr)))
            return maxIndex;

        // Binary search: calculate midpoint
        const midIndex = Math.floor((minIndex + maxIndex) / 2);

        // If we can't narrow down further or found exact match at mid
        if (minIndex === midIndex ||
            operatorArray[midIndex].slice(0, 2).map((element, index) => searchOperator[index] === element).reduce((acc, curr) => (acc && curr))) {
            minIndex = midIndex;
            break;
        }

        // Adjust search bounds based on comparison
        // Compare layer first, then exponent if layers are equal
        if (operatorArray[midIndex][0] < searchOperator[0] ||
            (searchOperator[0] === operatorArray[midIndex][0] && operatorArray[midIndex][1] < searchOperator[1])) {
            minIndex = midIndex; // Search in upper half
        }

        if (operatorArray[midIndex][0] > searchOperator[0] ||
            (searchOperator[0] === operatorArray[midIndex][0] && operatorArray[midIndex][1] > searchOperator[1])) {
            maxIndex = midIndex; // Search in lower half
        }
    }

    // Return exact index if found, otherwise return a decimal value indicating insertion position
    return (operatorArray[minIndex][1] === searchOperator[1] && operatorArray[minIndex][0] === searchOperator[0])
        ? minIndex
        : minIndex + 0.5;
}

export default getOperatorIndex;