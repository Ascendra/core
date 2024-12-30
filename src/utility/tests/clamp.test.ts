import { clamp } from "../clamp";

describe("clamp", () => {
    it("returns the min when value is less than min", () => {
        expect(clamp(1, 2, 5)).toBe(2);
    });

    it("returns the value when value is greater than min and less than max", () => {
        expect(clamp(3, 2, 5)).toBe(3);
    });

    it("returns the max when value is greater than max", () => {
        expect(clamp(7, 2, 5)).toBe(5);
    });
});
