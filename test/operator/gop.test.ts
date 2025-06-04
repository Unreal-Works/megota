import { expect, it } from "@jest/globals";
import Megota from "../../src";
import gop from "../../src/core/operator/gop";

it('should get operator values correctly', () => {
    const num = new Megota(5);

    // Get the value at [0, 0]
    expect(gop(num, [0, 0])).toBe(5);
});