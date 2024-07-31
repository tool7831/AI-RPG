import { Status } from './status';

interface ItemData {
    item_name: string;
    item_type: string;
    item_description: string;
    use_restriction: Record<string, number>;
    effect: Record<string, number>;
}

class Item {
    name: string;
    type: string;
    description: string;
    restriction: Record<string, number>;
    effect: Record<string, number>;

    constructor(item: ItemData) {
        this.name = item.item_name;
        this.type = item.item_type;
        this.description = item.item_description;
        this.restriction = item.use_restriction;
        this.effect = item.effect;
    }
}

class Inventory {
    inventory: Item[];
    max_inv: number;

    constructor(maxInv: number) {
        this.inventory = [];
        this.max_inv = maxInv;
    }

    addItem(item: Item): void {
        if (this.inventory.length < this.max_inv) {
            this.inventory.push(item);
        } else {
            console.log('max_inv');
        }
    }

    removeItem(item: Item): void {
        const index = this.inventory.indexOf(item);
        if (index !== -1) {
            this.inventory.splice(index, 1);
        }
    }

    addMaxInv(value: number): void {
        this.max_inv = Math.max(this.max_inv + value, 0);
    }

    isFull(): boolean {
        return this.inventory.length < this.max_inv;
    }
}

class Equipment {
    helmet: Item | null;
    armor: Item | null;
    pants: Item | null;
    gloves: Item | null;
    shoes: Item | null;
    ring1: Item | null;
    ring2: Item | null;
    earring1: Item | null;
    earring2: Item | null;
    necklace: Item | null;
    rightHand: Item | null;
    leftHand: Item | null;

    constructor() {
        this.helmet = null;
        this.armor = null;
        this.pants = null;
        this.gloves = null;
        this.shoes = null;
        this.ring1 = null;
        this.ring2 = null;
        this.earring1 = null;
        this.earring2 = null;
        this.necklace = null;
        this.rightHand = null;
        this.leftHand = null;
    }

    equip(slot: string, item: Item): Item | null {
        const prev = (this as any)[slot];
        (this as any)[slot] = item;
        return prev;
    }

    unequip(slot: string): Item | null {
        const item = (this as any)[slot];
        (this as any)[slot] = null;
        return item;
    }
}

class Player {
    name: string;
    description: string;
    status: Status;
    equipment: Equipment;
    inventory: Inventory;

    constructor(name: string, description: string, statusData: Record<string, number>) {
        this.name = name;
        this.description = description;
        this.status = new Status(statusData);
        this.equipment = new Equipment();
        this.inventory = new Inventory(30);
    }

    equip(slot: string, item: Item): void {
        let flag = true;
        for (const [key, value] of Object.entries(item.restriction)) {
            if (this.status.max_status[key] < value) {
                flag = false;
                break;
            }
        }

        if (flag) {
            const prev = this.equipment.equip(slot, item);
            if (prev !== null) {
                this.inventory.addItem(prev);
                for (const [key, value] of Object.entries(prev.effect)) {
                    this.status.changeAddedValue(key, -value);
                }
            }

            for (const [key, value] of Object.entries(item.effect)) {
                this.status.changeAddedValue(key, value);
            }

            this.inventory.removeItem(item);
        }
    }

    unequip(slot: string): void {
        const item = this.equipment.unequip(slot);
        if (item !== null) {
            for (const [key, value] of Object.entries(item.effect)) {
                this.status.changeAddedValue(key, -value);
            }
            this.inventory.addItem(item);
        }
    }

    addItem(item: Item): void {
        this.inventory.addItem(item);
    }

    removeItem(item: Item): void {
        this.inventory.removeItem(item);
    }

    toDict(): Record<string, any> {
        return {
            name: this.name,
            description: this.description,
            status: this.status.toDict()
        };
    }
}
