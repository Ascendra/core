import { DEBUG, INT16_MAX, INT16_MIN } from "../models/constants";
import { Vector } from "../models/Vector";
import { assert } from "./assert";
import { clamp } from "./clamp";
import { Pool } from "./Pool";

export class Point {
    public static LEFT = Point.create(-1, 0);
    public static RIGHT = Point.create(1, 0);
    public static UP = Point.create(0, -1);
    public static DOWN = Point.create(0, 1);
    public static ZERO = Point.create(0, 0);

    private static vectors = new Pool<Vector>(() =>
        new Int16Array(2) as Vector
    );

    public static create(x: number, y: number): Vector {
        const newVector = this.vectors.new();

        if (DEBUG) {
            const min = INT16_MIN;
            const max = INT16_MAX;

            assert(
                clamp(x, min, max) === x,
                `A new Point must have an x within: ${min} and ${max}; recieved: ${x}`
            );
            assert(
                clamp(y, min, max) === y,
                `A new Point must have a y within: ${min} and ${max}; recieved: ${y}`
            );
        }

        newVector[0] = x;
        newVector[1] = y;

        return newVector;
    }
}
