export class Vector {
    public static LEFT = new Vector([-1, 0]);
    public static RIGHT = new Vector([1, 0]);
    public static UP = new Vector([0, -1]);
    public static DOWN = new Vector([0, 1]);
    public static ZERO = new Vector([0, 0]);

    private value: number[];

    constructor(initialValue: number[]) {
        this.value = initialValue;
    }

    public get dimension(): number {
        return this.value.length;
    }
}
