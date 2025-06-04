import { expect, it } from "@jest/globals";
import Megota from "../../src";
import getOperatorIndex from "../../src/core/operator/getOperatorIndex";

it('should use getOperatorIndex correctly', () => {
    const num = new Megota();
    num.array = [[0, 0, 5], [1, 0, 10], [1, 1, 15]];

    // Test binary search functionality
    expect(getOperatorIndex(num, [0, 0])).toBe(0);
    expect(getOperatorIndex(num, [1, 0])).toBe(1);
    expect(getOperatorIndex(num, [1, 1])).toBe(2);
    expect(getOperatorIndex(num, [2, 0])).toBe(1.5); // Where it would be if it existed
});
