import { Status, StatusData, StatusDict } from './status.ts';
import { AttackData, DefendData, SmiteData } from './skill.ts'
import { Item, Inventory, ItemType, InventoryData } from './item.ts';
import Actor from './actor.ts';

export class Player extends Actor {
  public exp: number;
  public gold: number;
  public level: number;
  public nextExp: number;
  public statPoints: number;

  public inventory: Inventory;


  constructor(name: string, description: string, level:number, exp:number, nextExp:number, statPoints:number, status: StatusDict, attacks: AttackData[], defends: DefendData[], smites:SmiteData[], inventory:InventoryData) {
    super(name, description, attacks, defends, smites)

    this.level = level;
    this.exp = exp;
    this.nextExp = nextExp;
    this.statPoints = statPoints;

    this.status = new Status(status.origin_status, status.added_status);
    this.inventory = Inventory.fromJSON(inventory);

  }

  gainExp(value: number): void {
    this.exp += value;
    if (this.exp >= this.nextExp) {
      console.log('Level up!');
      this.level += 1;
      this.exp -= this.nextExp;
      this.nextExp += 100;
      this.statPoints += 5;
      if (this.status.status.hp < this.status.origin_status.hp)
        this.status.changeAddedValue('hp',-this.status.added_status.hp);
      if (this.status.status.mp < this.status.origin_status.mp)
        this.status.changeAddedValue('mp',-this.status.added_status.mp);
    }
  }

  getRewards(json): void {
    if (!json)
      return
    if ('exp' in json)
      this.gainExp(json.exp);
    if ('gold' in json)
      this.gold += json.gold;
    if ('items' in json) {
      json.items.forEach((item) => {
        this.addItem(Item.fromJSON(item));
      }) 
    }
  }

  getPenalty(json): void {
    if (!json)
      return
    if ('damage' in json)
      this.status.damaged(json.value, null)
    if ('gold' in json)
      this.gold -= json.gold;
    if ('stats' in json) {
      json.stats.forEach((stat) => {
        if (json.stats[stat] !== null) {
          this.status.changeOriginValue(stat, json.stats[stat])
        }
      }) 
    }
  }

  doAction(action: number, skill_idx: number): Record<string, any> {
    this.startTurn();
    if (this.getActionAvailable()) {
      if (action === 0)
        return this.doAttack(skill_idx)
      else if (action === 1)
        return this.doDefend(skill_idx)
      else if (action === 2)
        return this.doSmite(skill_idx)
      return { name: 'skip' }
    }
    return {name: 'skip'}
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

  endCombat(): void {
    this.status.changeAddedValue('shield', -this.status.added_status.shield);
    this.status.curStatusEffects = [];
  }

  toDict(): Record<string, any> {
    return {
      name: this.name,
      description: this.description,
      level: this.level,
      exp: this.exp,
      nextExp: this.nextExp,
      statPoints: this.statPoints,
      inventory: this.inventory.toDict(),
      status: this.status.toDict(),
      attacks: this.attacks.map((atk)=>atk.toDict()),
      defends: this.defends.map((def)=>def.toDict()),
      smites: this.smites.map((smi)=>smi.toDict()),
    };
  }

  static fromJSON(json: { name: string, description: string, level:number, exp:number, nextExp:number, statPoints:number, status: StatusDict, attacks: AttackData[], defends: DefendData[], smites:SmiteData[], inventory:InventoryData}) {
    return new Player(json.name, json.description, json.level, json.exp, json.nextExp, json.statPoints, json.status, json.attacks, json.defends, json.smites, json.inventory);
  }
}

export default Player;
