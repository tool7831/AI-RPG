import { Status, StatusData, StatusDict } from './status.ts';
import { Attack, Defend, Smite, AttackData, DefendData, SmiteData } from './skill.ts'
import { Item, Inventory, ItemType, InventoryData } from './item.ts';


function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Player {
  public name: string;
  public description: string;
  public status: Status;
  public inventory: Inventory;
  public attacks: Attack[];
  public defends: Defend[];
  public smites: Smite[];

  constructor(name: string, description: string, status: StatusDict, attacks: AttackData[], defends: DefendData[], smites:SmiteData[], inventory:InventoryData) {
    this.name = name;
    this.description = description;
    this.status = new Status(status.origin_status, status.added_status);
    this.inventory = Inventory.fromJSON(inventory);

    this.attacks = attacks.map(atk => new Attack(atk))
    this.defends = defends.map(def => new Defend(def))
    this.smites = smites.map(smi => new Smite(smi))
  }

  doAction(action: number, skill_idx: number): Record<string, any> {
    this.reduceCoolDown(1)
    this.status.updateStatusEffects()
    this.status.updateBuffs()
    if (action === 0)
      return this.doAttack(skill_idx)
    else if (action === 1)
      return this.doDefend(skill_idx)
    else if (action === 2)
      return this.doSmite(skill_idx)
    return { name: 'skip' }
  }

  doAttack(idx: number): Record<string, any> {
    return this.attacks[idx].doAttack(this.status.status);
  }

  doDefend(idx: number): Record<string, any> {
    return this.defends[idx].doDefend(this.status.status);
  }

  doSmite(idx: number): Record<string, any> {
    return this.smites[idx].doSmite(this.status.status);
  }

  damaged(skill) {
    for (let i = 0; i < skill.count; i++) {
      const attack_rand = rand(0, 99)
      if (attack_rand < skill.accuracy) {
        console.log('damage')
        this.status.damaged(skill.damage)
        const effect_rand = rand(0, 99)
        if (effect_rand < skill.statusEffect.accuracy) {
          const statusEffect = { name: skill.name, type: skill.statusEffect.type, value: skill.statusEffect.value, duration: skill.statusEffect.duration }
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

  equip(idx: number): void {
    let flag = true;
    const item = this.inventory.items[idx]
    for (const [key, value] of Object.entries(item.use_restriction)) {
      if (this.status.origin_status[key] < value) {
        flag = false;
        break;
      }
    }

    if (flag) {
      const data = this.inventory.equip(idx);
      if (data.before !== null) {
        for (const [key, value] of Object.entries(data.before.effects)) {
          this.status.changeAddedValue(key as keyof StatusData, -value);
        }
      }
      if (data.after !== null) {
        for (const [key, value] of Object.entries(data.after.effects)) {
          this.status.changeAddedValue(key as keyof StatusData, value);
        }
      }
    }
  }

  unequip(type: ItemType): void {
    const item = this.inventory.unequip(type);
    if(item !== null){
      for (const [key, value] of Object.entries(item.effects)) {
        this.status.changeAddedValue(key as keyof StatusData, -value);
      }
    }
  }

  addItem(item: Item): void {
    this.inventory.addItem(item);
  }

  removeItem(idx: number): void {
    this.inventory.removeItem(idx);
  }

  isDead(): boolean {
    return this.status.isDead()
  }
  toDict(): Record<string, any> {
    return {
      name: this.name,
      description: this.description,
      inventory: this.inventory.toDict(),
      status: this.status.toDict(),
      attacks: this.attacks.map((atk)=>atk.toDict()),
      defends: this.defends.map((def)=>def.toDict()),
      smites: this.smites.map((smi)=>smi.toDict()),
    };
  }

  static fromJSON(json: { name: string; description: string; status: StatusDict, attacks: AttackData[], defends: DefendData[], smites:SmiteData[], inventory:InventoryData}) {
    return new Player(json.name, json.description, json.status, json.attacks, json.defends, json.smites, json.inventory);
  }
}
