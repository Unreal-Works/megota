import { expect, it } from "@jest/globals";
import Megota from "../../src";
import gop from "../../src/core/operator/gop";
import sop from "../../src/core/operator/sop";

it('should get and set operator values correctly', () => {
    const num = new Megota(5);

    // Get the value at [0, 0]
    expect(gop(num, [0, 0])).toBe(5);

    // Set a new value
    sop(num, [0, 0], 1);
    expect(gop(num, [0, 0])).toBe(1);

    // Set it back to original
    sop(num, [0, 0], 0);
    expect(gop(num, [0, 0])).toBe(0);
});
