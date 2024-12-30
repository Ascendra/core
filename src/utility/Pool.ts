export class Pool<ItemType = any> {
    private downsizeThreshold = 0.75;
    private upsizeThreshold = 0;
    private items = new Set<ItemType>();
    private staleItems: ItemType[] = [];

    public get size(): number {
        return this.items.size;
    }

    constructor(private itemBuilder: () => ItemType) {
        this.populate(4);
    }

    public new(): ItemType {
        const totalItems = this.items.size;
        const amountOfAvailableItems = this.staleItems.length;
        const upsizeThresholdAmount = Math.round(
            totalItems * this.upsizeThreshold
        );

        if (amountOfAvailableItems <= upsizeThresholdAmount) {
            this.populate(Math.max(totalItems, 2));
        }

        return this.staleItems.pop()!;
    }

    public release(item: ItemType): void {
        this.staleItems.push(item);

        const totalItems = this.items.size;
        const amountOfAvailableItems = this.staleItems.length;

        const downsizeThresholdAmount = Math.round(
            totalItems * this.downsizeThreshold
        );

        if (amountOfAvailableItems >= downsizeThresholdAmount) {
            this.depopulate(Math.round(totalItems / 2));
            return;
        }
    }

    private populate(amount: number): void {
        for (let i = 0; i < amount; i++) {
            const newItem = this.itemBuilder();
            this.items.add(newItem);
            this.staleItems.push(newItem);
        }
    }

    private depopulate(amount: number): void {
        let itemsToRemove = amount;

        while (this.staleItems.length > 0 && itemsToRemove > 0) {
            const itemToDelete = this.staleItems.pop()!;
            this.items.delete(itemToDelete);
            itemsToRemove--;
        }
    }
}
