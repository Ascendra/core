import { Vector } from "./Vector";

export class Matrix {
    private value: Vector[];

    constructor(intialValue: Vector[]) {
        this.value = intialValue;
    }
}
