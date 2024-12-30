import { AABB } from "../models/AABB";
import { DEBUG, INT16_MAX, INT16_MIN } from "../models/constants";
import { assert } from "./assert";
import { clamp } from "./clamp";
import { Pool } from "./Pool";

export class Rectangle {
    private static aabbs = new Pool<AABB>(() => new Int16Array(4) as AABB);

    public static create(
        x: number,
        y: number,
        width: number,
        height: number
    ): AABB {
        const newAabb = this.aabbs.new();

        if (DEBUG) {
            const min = INT16_MIN;
            const max = INT16_MAX;

            assert(
                clamp(x, min, max) === x,
                `A new Rectangle must have an x within: ${min} and ${max}; recieved: ${x}`
            );
            assert(
                clamp(y, min, max) === y,
                `A new Rectangle must have a y within: ${min} and ${max}; recieved: ${y}`
            );
            assert(
                clamp(x + width, min, max) === x + width,
                `A new Rectangle must have a width within: ${min} and ${max}; recieved: ${x} + ${width} = ${
                    x + width
                }`
            );
            assert(
                clamp(y + height, min, max) === y + height,
                `A new Rectangle must have a height within: ${min} and ${max}; recieved: ${y} + ${height} = ${
                    y + height
                }`
            );
        }

        newAabb[0] = x;
        newAabb[1] = y;
        newAabb[2] = x + width;
        newAabb[3] = y + height;

        return newAabb;
    }

    public static intersects(aabb1: AABB, aabb2: AABB): boolean {
        // this is incorrect
        return (aabb1[0] > aabb2[3] && aabb1[1] < aabb2[4])
            || (aabb1[0] < aabb2[2] && aabb1[3] < aabb2[3]);
    }
}
