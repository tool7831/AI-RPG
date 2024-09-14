import { StatusData } from "./status";


export enum ItemType {
  Helmet = 'helmet',
  Armor = 'armor',
  Pants = 'pants',
  Shoes = 'shoes',
  Gloves = 'gloves',
  RightHand = 'rightHand',
  LeftHand = 'leftHand',
  Ring1 = 'ring1',
  Ring2 = 'ring2',
  Earring1 = 'earring1',
  Earring2 = 'earring2',
  Necklace = 'necklace',
  Consumable = 'consumable',
}

export interface ItemData {
  name: string;
  type: ItemType;
  description: string;
  effects: Record<keyof StatusData, number>;
  use_restriction: Record<keyof StatusData, number>;
}

export interface EquipmentsData {

  helmet: Item | null,
  armor: Item | null,
  pants: Item | null,
  shoes: Item | null,
  gloves: Item | null,
  rightHand: Item | null,
  leftHand: Item | null,
  ring1: Item | null,
  ring2: Item | null,
  earring1: Item | null,
  earring2: Item | null,
  necklace: Item | null,

}

export class Item {

  public name: string;
  public type: ItemType;
  public description: string;
  public effects: Record<keyof StatusData, number>;
  public use_restriction: Record<keyof StatusData, number>;


  constructor(name: string, type: ItemType, description: string, effects: Record<keyof StatusData, number>, use_restriction: Record<keyof StatusData, number>) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.effects = effects;
    this.use_restriction = use_restriction;
  }

  toDict(): ItemData {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      effects: this.effects,
      use_restriction: this.use_restriction,
    }
  }
}


export class Inventory {
  protected items: Item[];
  protected equiments: EquipmentsData;
  protected max_size: number;

  constructor() {
    this.equiments = {
      helmet: null,
      armor: null,
      pants: null,
      shoes: null,
      gloves: null,
      rightHand: null,
      leftHand: null,
      ring1: null,
      ring2: null,
      earring1: null,
      earring2: null,
      necklace: null,
    };
    this.items = [];
    this.max_size = 30;
  }

  addItem(item:Item): boolean {
    if (this.items.length < this.max_size) {
      this.items.push(item);
      return true
    }
    else {
      return false
    }
  }

  removeItem(idx:number): Item {
    return this.items.splice(idx,1)[0];
  }

  use(idx: number) {
    const item = this.items[idx];
    this.removeItem(idx);
    return item;
  }

  equip(idx: number): Record<string,Item>{
    const item = this.removeItem(idx);
    const beforeItem = this.unequip(item.type)
    this.equiments[item.type] = item;
    return {
      after: this.equiments[item.type],
      before: beforeItem,
    }
  }

  unequip(type: ItemType) {
    const item = this.equiments[type];
    if(item !== null && this.addItem(item)) {
      this.equiments[type] = null;
      return item
    }
    return null
  }

  get_item(idx: number) {
    return this.items[idx]
  }

  get_items(){
    return this.items;
  }

  toDict() {
    return {
      items: this.items.map((i)=>i.toDict()),
      equiments: Object.fromEntries(
        Object.entries(this.equiments).map(([key, item]) => [
          key,
          item ? item.toDict() : null
        ])
      ),
    }
  }
}