import { Status, StatusData, StatusDict } from './status.ts';
import { Attack, Defend, Smite, AttackData, DefendData, SmiteData } from './skill.ts'

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

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Player {
    public name: string;
    public description: string;
    public status: Status;
    public equipment: Equipment;
    public inventory: Inventory;
    public attacks: Attack[];
    public defends: Defend[];
    public smites: Smite[];

    constructor(name: string, description: string, status: StatusDict, attacks: AttackData[], defends: DefendData[]) {
        this.name = name;
        this.description = description;
        this.status = new Status(status.origin_status, status.added_status);
        this.equipment = new Equipment();
        this.inventory = new Inventory(30);

        this.attacks = attacks.map(atk => new Attack(atk))
        this.defends = defends.map(def => new Defend(def))
        this.smites = []
    }

    doAction(action:number, skill_idx:number):Record<string,any> {
        this.reduceCoolDown(1)
        this.status.updateStatusEffects()
        this.status.updateBuffs()
        if (action === 0)
            return this.doAttack(skill_idx)
        else if (action === 1)
            return this.doDefend(skill_idx)
        else if (action === 2)
            return this.doSmite(skill_idx)
        return {name: 'skip'}
    }

    doAttack(idx:number): Record<string,any> {
        return this.attacks[idx].doAttack(this.status.status); 
    }

    doDefend(idx:number): Record<string,any> {
        return this.defends[idx].doDefend(this.status.status); 
    }

    doSmite(idx: number): Record<string, any> {
        return this.smites[idx].doSmite(this.status.status);
    }

    damaged(skill) {
        for(let i = 0; i < skill.count; i++){
            const attack_rand = rand(0,99)
            if (attack_rand < skill.accuracy) {
                console.log('damage')
                this.status.damaged(skill.damage)
                const effect_rand = rand(0,99)
                if (effect_rand < skill.statusEffect.accuracy) {
                    const statusEffect = {name: skill.name, type: skill.statusEffect.type, value: skill.statusEffect.value, duration : skill.statusEffect.duration}
                    this.status.addStatusEffect(statusEffect)
                }
            }
            else {
                console.log('miss')
            }
        }
    }

    reduceCoolDown(value: number) {
        this.attacks.forEach((atk) => atk.reduceCooldown(value))
        this.defends.forEach((def) => def.reduceCooldown(value))
        this.smites.forEach((smi) => smi.reduceCooldown(value))
    }
    // equip(slot: string, item: Item): void {
    //     let flag = true;
    //     for (const [key, value] of Object.entries(item.restriction)) {
    //         if (this.status.origin_status[key] < value) {
    //             flag = false;
    //             break;
    //         }
    //     }

    //     if (flag) {
    //         const prev = this.equipment.equip(slot, item);
    //         if (prev !== null) {
    //             this.inventory.addItem(prev);
    //             for (const [key, value] of Object.entries(prev.effect)) {
    //                 this.status.changeAddedValue(key, -value);
    //             }
    //         }

    //         for (const [key, value] of Object.entries(item.effect)) {
    //             this.status.changeAddedValue(key, value);
    //         }

    //         this.inventory.removeItem(item);
    //     }
    // }

    // unequip(slot: string): void {
    //     const item = this.equipment.unequip(slot);
    //     if (item !== null) {
    //         for (const [key, value] of Object.entries(item.effect)) {
    //             this.status.changeAddedValue(key, -value);
    //         }
    //         this.inventory.addItem(item);
    //     }
    // }

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

    static fromJSON(json: { name: string; description: string; status: StatusDict, attacks: AttackData[], defends: DefendData[] }) {
        return new Player(json.name, json.description, json.status, json.attacks, json.defends);
    }
}
