import { Status, StatusData, StatusDict } from './status.ts';
import { Attack, AttackData, AttackType, Defend, DefendData, Smite, SmiteData } from './skill.ts'
import { Item, Inventory, ItemType, InventoryData } from './item.ts';
import Actor from './actor.ts';

export class Player extends Actor {
  static className: string = 'Player';
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

  getRewards(rewards): void {

    if ('stats' in rewards) {
      Object.keys(rewards.stats).forEach((stat) => {
        if (rewards.stats[stat] !== null) {
          this.status.changeOriginValue(stat as keyof StatusData, rewards.stats[stat])
        }
      }) 
    }
    if ('exp' in rewards)
      this.gainExp(rewards.exp);
    if ('gold' in rewards)
      this.gold += rewards.gold;
    if ('items' in rewards) {
      rewards.items.forEach((item) => {
        this.addItem(Item.fromJSON(item));
      }) 
    }

  }

  getPenalty(penalty): void {
    console.log("get penalty")
    penalty.forEach((json) => {
      console.log(json);
      if (json.type === 'damage') {
        console.log(json);
        this.status.changeHP(-json.value);
      }
        
      if (json.type === 'gold') {
        this.gold -= json.gold;
      }
        
      if (json.type === 'stats') {
        Object.keys(json.value).forEach((stat) => {
          if (json.value[stat] !== null) {
            this.status.changeOriginValue(stat as keyof StatusData, json.value[stat])
          }
        }) 
      }
    })
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

  addAttackSkill(skill: AttackData): number {
    if(this.attacks.length < 4) {
      this.attacks.push(new Attack(skill));
      return 1;
    }
    return 0;
  }

  addDefendSkill(skill: DefendData): number {
    if(this.defends.length < 4) {
      this.defends.push(new Defend(skill));
      return 1;
    }
    return 0;
  }

  addSmiteSKill(skill: SmiteData): number {
    if(this.smites.length < 4) {
      this.smites.push(new Smite(skill));
      return 1;
    }
    return 0;
  }
  addSkill(actionType: number, skill: any): number {
    if (actionType === 0) {
      return this.addAttackSkill(skill);
    }
    else if (actionType === 1) {
      return this.addDefendSkill(skill);
    }
    else if (actionType === 2) {
      return this.addSmiteSKill(skill);
    }
    return 0;
  }

  removeSkill(skillType: number, idx: number): number {
    if(skillType === 0) {
      this.attacks.splice(idx, 1);
      return 1;
    }
    else if (skillType === 1){
      this.defends.splice(idx, 1);
      return 1;
    }
    else if (skillType === 2) {
      this.smites.splice(idx, 1);
      return 1;
    }
    return 0;
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
