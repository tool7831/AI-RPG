import { StatusData } from "./status";

export interface InventoryData {
  items: ItemData[],
  equipments: EquipmentsData,
}

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
  static fromJSON(json) {
    return new Item(json.name, json.type, json.description, json.effects, json.use_restriction)
  }
}


export class Inventory {
  public items: Item[];
  public equipments: EquipmentsData;
  public max_size: number;

  constructor(items: Item[], equipments: EquipmentsData) {
    this.equipments = equipments;
    this.items = items
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

  equip(idx: number): Record<string,Item|null>{
    const item = this.removeItem(idx);
    const beforeItem = this.unequip(item.type)

    this.equipments[item.type] = item;
    return {
      after: this.equipments[item.type],
      before: beforeItem,
    }
  }

  unequip(type: ItemType): Item | null {
    const item = this.equipments[type];
    if(item !== null && this.addItem(item)) {
      this.equipments[type] = null;
      return item
    }
    return null
  }


  toDict() {
    return {
      items: this.items.map((i)=>i.toDict()),
      equipments: Object.fromEntries(
        Object.entries(this.equipments).map(([key, item]) => [
          key,
          item ? item.toDict() : null
        ])
      ),
    }
  }

  static fromJSON(json: {items: ItemData[], equipments: EquipmentsData}) {
    const items = json.items.map((item)=>Item.fromJSON(item));
    const equipments = Object.keys(json.equipments).reduce((acc,key) => {
      if (json.equipments[key]) {
        acc[key] = Item.fromJSON(json.equipments[key]);
      }
      else {
        acc[key] = null
      }
      return acc;
    }, {})
    return new Inventory(items, equipments as EquipmentsData)
  }
}