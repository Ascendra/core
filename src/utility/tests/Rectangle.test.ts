import { Rectangle } from "../Rectangle";

describe("Rectangle", () => {
    it("should return true if two rectangles overlap", () => {
        const rect1 = Rectangle.create(0, 0, 100, 100);
        const rect2 = Rectangle.create(50, 50, 100, 100);

        expect(Rectangle.intersects(rect1, rect2)).toBe(true);

        const rect3 = Rectangle.create(100, 100, 100, 100);

        expect(Rectangle.intersects(rect1, rect3)).toBe(false);
    });
});
