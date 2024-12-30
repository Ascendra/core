import { Pool } from "../Pool";

const add = (pool: Pool, amount: number) => {
    const items = [];
    for (let i = 0; i < amount; i++) {
        items.push(pool.new());
    }
    return items;
};

describe("Pool", () => {
    it("starts with 4 items", () => {
        const pool = new Pool(() => []);
        expect(pool.size).toBe(4);
    });

    it("doubles total items when at max items", () => {
        const pool = new Pool(() => []);

        add(pool, 4);
        expect(pool.size).toBe(4);

        add(pool, 1);
        expect(pool.size).toBe(8);
    });

    it("reduces total items by half when only 25% of items are in use", () => {
        const pool = new Pool(() => []);

        const items = add(pool, 8);
        expect(pool.size).toBe(8);

        for (let i = 0; i < 5; i++) {
            const itemToDelete = items.pop();
            pool.release(itemToDelete);
            expect(pool.size).toBe(8);
        }

        expect(items.length).toBe(3);

        const itemToTriggerReduction = items.pop();
        pool.release(itemToTriggerReduction);
        expect(pool.size).toBe(4);
    });

    it("reuses objects in pool", () => {
        const pool = new Pool(() => []);

        const items = add(pool, 4);
        expect(items.length).toBe(4);

        const releasedItem = items.pop();
        pool.release(releasedItem);

        expect(pool.new()).toBe(releasedItem);
    });

    it("reuses objects as they were when released", () => {
        const pool = new Pool(() => []);

        const items = add(pool, 4);
        expect(items.length).toBe(4);

        const releasedItem = items.pop();
        releasedItem.push("test");
        pool.release(releasedItem);

        const reusedItem = pool.new();
        expect(reusedItem.length).toBe(1);
        expect(reusedItem[0]).toBe("test");
    });
});
