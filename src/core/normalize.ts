import { MegotaConfiguration } from "./Configuration";
import { PrimitiveConstants } from "./constants";

/**
 * Normalizes the MegotaNumber instance.
 * This method ensures that the internal representation of the number is consistent and adheres to the defined rules.
 * It sorts the array, removes duplicates, and adjusts the layer and sign as necessary.
 * 
 * @param value The number represented as a {@link BaseMegota} to normalize.
 * @returns The normalized MegotaNumber instance.
 */
function normalize(value: BaseMegota): BaseMegota {
    // Early returns for special cases
    if (!value.array || !value.array.length) {
        value.array = [[0, 0, 0]];
        return value;
    }

    // Handle sign normalization once
    if (value.sign !== 1 && value.sign !== -1) {
        value.sign = typeof value.sign === "number" ? (value.sign < 0 ? -1 : 1) : 1;
    }

    // Handle large layer immediately
    if (value.layer > PrimitiveConstants.MAX_SAFE_INTEGER) {
        value.array = [[0, 0, Infinity]];
        value.layer = 0;
        return value;
    }

    // Ensure layer is an integer
    if (value.layer !== Math.floor(value.layer)) {
        value.layer = Math.floor(value.layer);
    }

    // Check for NaN or Infinity in a single pass with early returns
    for (let i = 0; i < value.array.length; i++) {
        const e = value.array[i];

        // Fix undefined/null values
        if (e[0] === null || e[0] === undefined) e[0] = 0;

        // Remove elements with zero coefficient (except the base element)
        if ((e[0] !== 0 || e[1] !== 0) && !e[2]) {
            value.array.splice(i, 1);
            i--;
            continue;
        }

        // Early return for NaN
        if (isNaN(e[0]) || isNaN(e[1]) || isNaN(e[2])) {
            value.array = [[0, 0, NaN]];
            return value;
        }

        // Early return for Infinity
        if (!isFinite(e[0]) || !isFinite(e[1]) || !isFinite(e[2])) {
            value.array = [[0, 0, Infinity]];
            return value;
        }

        // Ensure integers where needed
        if (!Number.isInteger(e[0])) e[0] = Math.floor(e[0]);
        if (!Number.isInteger(e[1])) e[1] = Math.floor(e[1]);
        if ((e[0] !== 0 || e[1] !== 0) && !Number.isInteger(e[2])) {
            e[2] = Math.floor(e[2]);
        }
    }

    // Sorting - sort only once before the main normalization loop
    // Sort by layer first, then by operation type
    value.array.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return a[1] - b[1];
    });

    // Truncate if too many operations
    if (value.array.length > MegotaConfiguration.maxOps) {
        value.array = value.array.slice(-MegotaConfiguration.maxOps);
    }

    // Main normalization loop - run until no more changes
    let changed = true;
    const maxIterations = 100; // Prevent infinite loops
    let iterations = 0;

    while (changed && iterations < maxIterations) {
        iterations++;
        changed = false;

        // Handle empty array
        if (!value.array.length) {
            value.array = [[0, 0, 0]];
            changed = true;
            continue;
        }

        // Handle layer promotion
        const lastIndex = value.array.length - 1;
        if (value.array[lastIndex][0] > PrimitiveConstants.MAX_SAFE_INTEGER) {
            value.layer++;
            value.array = [[0, 0, value.array[lastIndex][0]]];
            changed = true;
            continue;
        }

        // Handle layer demotion
        if (value.layer && value.array.length === 1 && value.array[0][0] === 0 && value.array[0][1] === 0) {
            value.layer--;
            if (value.array[0][2] === 0) {
                value.array = [[0, 0, 10]];
            } else {
                value.array = [[0, 0, 10], [Math.round(value.array[0][2]), 0, 1]];
            }
            changed = true;
            continue;
        }

        // Ensure the first element is a base element if needed
        if (value.array.length < MegotaConfiguration.maxOps && (value.array[0][0] !== 0 || value.array[0][1] !== 0)) {
            value.array.unshift([0, 0, 10]);
            changed = true;
            continue;
        }

        // Combine like terms - use a single pass with direct checks
        for (let i = 0; i < value.array.length - 1; i++) {
            if (value.array[i][0] === value.array[i + 1][0] && value.array[i][1] === value.array[i + 1][1]) {
                value.array[i][2] += value.array[i + 1][2];
                value.array.splice(i + 1, 1);
                i--;
                changed = true;
            }
        }

        // Handle large base value conversion to scientific notation
        if (value.array[0][0] === 0 && value.array[0][1] === 0 && value.array[0][2] > PrimitiveConstants.MAX_SAFE_INTEGER) {
            if (value.array.length >= 2 && value.array[1][0] === 0 && value.array[1][1] === 1) {
                value.array[1][2]++;
            } else {
                value.array.splice(1, 0, [0, 1, 1]);
            }
            value.array[0][2] = Math.log10(value.array[0][2]);
            changed = true;
            continue;
        }

        // Handle scientific notation conversion back to normal
        if (value.array.length >= 2 &&
            value.array[0][0] === 0 &&
            value.array[0][1] === 0 &&
            value.array[0][2] < PrimitiveConstants.MAX_E &&
            value.array[1][0] === 0 &&
            value.array[1][1] === 1 &&
            value.array[1][2]) {

            value.array[0][2] = Math.pow(10, value.array[0][2]);
            if (value.array[1][2] > 1) {
                value.array[1][2]--;
            } else {
                value.array.splice(1, 1);
            }
            changed = true;
            continue;
        }

        // Handle base-1 conversion
        if (value.array.length >= 2 &&
            value.array[0][0] === 0 &&
            value.array[0][1] === 0 &&
            value.array[0][2] === 1 &&
            value.array[1][2]) {

            if (value.array[1][2] > 1) {
                value.array[1][2]--;
            } else {
                value.array.splice(1, 1);
            }
            value.array[0][2] = 10;
            changed = true;
            continue;
        }

        // Handle special case for high-level operations
        if (value.array.length >= 2 &&
            value.array[0][0] === 0 &&
            value.array[0][1] === 0 &&
            (value.array[1][0] > 0 || value.array[1][1] !== 1)) {

            if (value.array[0][2]) {
                value.array.splice(1, 0, [value.array[1][0], value.array[1][1] - 1, value.array[0][2]]);
            }

            value.array[0][2] = 1;
            if (value.array[2][2] > 1) {
                value.array[2][2]--;
            } else {
                value.array.splice(2, 1);
            }

            if (value.array[1][1] === -1) {
                value.array[1] = [value.array[1][0] - 1, value.array[1][2], 1];
                value.array[0][2] = 10;
            }
            changed = true;
            continue;
        }

        // Handle large operation types and coefficients (combine these checks)
        for (let i = 1; i < value.array.length; i++) {
            // Check for large operation types
            if (value.array[i][1] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                if (i !== value.array.length - 1 && value.array[i + 1][0] === value.array[i][0] + 1) {
                    value.array[i + 1][0]++;
                } else {
                    value.array.splice(i + 1, 0, [value.array[i][0] + 1, 0, 1]);
                }

                if (value.array[0][0] === 0 && value.array[0][1] === 0) {
                    value.array[0][2] = value.array[i][1] + 1;
                } else {
                    value.array.unshift([0, 0, value.array[i][1] + 1]);
                }

                value.array.splice(1, i);
                changed = true;
                break; // Break to avoid processing a modified array
            }

            // Check for large coefficients
            if (value.array[i][2] > PrimitiveConstants.MAX_SAFE_INTEGER) {
                if (i !== value.array.length - 1 && value.array[i + 1][0] === value.array[i][0] + 1) {
                    value.array[i + 1][2]++;
                } else {
                    value.array.splice(i + 1, 0, [value.array[i][0], value.array[i][1] + 1, 1]);
                }

                if (value.array[0][0] === 0 && value.array[0][1] === 0) {
                    value.array[0][2] = value.array[i][2] + 1;
                } else {
                    value.array.unshift([0, 0, value.array[i][2] + 1]);
                }

                value.array.splice(1, i);
                changed = true;
                break; // Break to avoid processing a modified array
            }
        }
    }

    // Final check - ensure we have at least one element
    if (!value.array.length) {
        value.array = [[0, 0, 0]];
    }

    return value;
};

export default normalize;