from typing import Dict, List, Optional
from status import Status
from skill import Attack, Defend

class Item:
    def __init__(self, item_data: Dict[str, any]):
        self.name = item_data['item_name']
        self.type = item_data['item_type']
        self.description = item_data['item_description']
        self.restriction = item_data['use_restriction']
        self.effect = item_data['effect']


class Inventory:
    def __init__(self, max_inv: int):
        self.inventory: List[Item] = []
        self.max_inv = max_inv

    def add_item(self, item: Item) -> None:
        if len(self.inventory) < self.max_inv:
            self.inventory.append(item)
        else:
            print('max_inv')

    def remove_item(self, item: Item) -> None:
        if item in self.inventory:
            self.inventory.remove(item)

    def add_max_inv(self, value: int) -> None:
        self.max_inv = max(self.max_inv + value, 0)

    def is_full(self) -> bool:
        return len(self.inventory) < self.max_inv


class Equipment:
    def __init__(self):
        self.helmet: Optional[Item] = None
        self.armor: Optional[Item] = None
        self.pants: Optional[Item] = None
        self.gloves: Optional[Item] = None
        self.shoes: Optional[Item] = None
        self.ring1: Optional[Item] = None
        self.ring2: Optional[Item] = None
        self.earring1: Optional[Item] = None
        self.earring2: Optional[Item] = None
        self.necklace: Optional[Item] = None
        self.right_hand: Optional[Item] = None
        self.left_hand: Optional[Item] = None

    def equip(self, slot: str, item: Item) -> Optional[Item]:
        prev = getattr(self, slot, None)
        setattr(self, slot, item)
        return prev

    def unequip(self, slot: str) -> Optional[Item]:
        item = getattr(self, slot, None)
        setattr(self, slot, None)
        return item


class Player:
    def __init__(self, name: str, description: str, status_data: Dict[str, any]):
        self.name = name
        self.description = description
        self.status = Status(**status_data)
        self.equipment = Equipment()
        self.inventory = Inventory(30)
        self.attack: List[Attack] = []
        self.defend: List[Defend] = []

    def do_attack(self, idx: int) -> Dict[str, any]:
        return self.attack[idx].do_attack(self.status.status)

    def do_defend(self, idx: int) -> Dict[str, any]:
        return self.defend[idx].do_defend(self.status.status)

    def equip(self, slot: str, item: Item) -> None:
        flag = True
        for key, value in item.restriction.items():
            if self.status.max_status.get(key, 0) < value:
                flag = False
                break
        if flag:
            prev = self.equipment.equip(slot, item)
            if prev is not None:
                self.inventory.add_item(prev)
                for key, value in prev.effect.items():
                    self.status.change_added_value(key, -value)

            for key, value in item.effect.items():
                self.status.change_added_value(key, value)

            self.inventory.remove_item(item)

    def unequip(self, slot: str) -> None:
        item = self.equipment.unequip(slot)
        if item is not None:
            for key, value in item.effect.items():
                self.status.change_added_value(key, -value)
            self.inventory.add_item(item)

    def add_item(self, item: Item) -> None:
        self.inventory.add_item(item)

    def remove_item(self, item: Item) -> None:
        self.inventory.remove_item(item)

    def to_dict(self) -> Dict[str, any]:
        return {
            'name': self.name,
            'description': self.description,
            'status': self.status.to_dict()
        }

    @staticmethod
    def from_json(json: Dict[str, any]) -> 'Player':
        return Player(**json)
