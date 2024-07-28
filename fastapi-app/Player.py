from Status import Status

class Item():
    def __init__(self, item):
        self.name = item['Item Name']
        self.type = item['Item Type']
        self.description = item['Item Description']
        self.restriction = item['Use Restriction']
        self.effect = item['Effect']

class Inventory():
    def __init__(self, max_inv):
        self.inventory = list()
        self.max_inv = max_inv
    
    def add_item(self, item):
        if len(self.inventory) < self.max_inv:
            self.inventory.append(item)
        else:
            print('max_inv')
    
    def remove_item(self, item):
        self.inventory.remove(item)

    def add_max_inv(self, value):
        self.max_inv = self.max_inv + value if self.max_inv + value > 0 else 0 

    def isFull(self):
        return len(self.inventory) < self.max_inv


class Equipment():
    def __init__(self):
        self.helmet = None
        self.armor = None
        self.pants = None
        self.gloves = None
        self.shoes = None
        self.ring1 = None
        self.ring2 = None
        self.earring1 = None
        self.earring2 = None
        self.necklace = None
        self.right_hand = None
        self.left_hand = None

    def equip(self, slot, item):
        prev = getattr(self, slot)
        setattr(self, slot, item)
        return prev
    
    def unequip(self, slot):
        item = getattr(self, slot)
        setattr(self, slot, None)
        return item
    
    

class Player():
    def __init__(self, name, description, status):
        self.name = name
        self.description = description
        self.status = Status(status)

        self.equipment = Equipment()
        self.inventory = Inventory(30)

    def equip(self, slot, item):
        flag = True
        for key, value in item.restriction.items():
            if self.status.max_status[key] < value:
                flag = False

        if flag == True:
            prev = self.equipment.equip(slot, item)
            if prev is not None:
                self.inventory.add_item(prev)
                for key, value in prev.effect.items():
                    self.status.change_added_value(key, -value)

            for key, value in item.effect.items():
                self.status.change_added_value(key, value)
            
            self.inventory.remove_item(item)

    def unequip(self, slot):
        item = self.equipment.unequip(slot)
        for key, value in item.effect.items():
            self.status.change_added_value(key, value)
        self.inventory.add_item(item)

    def add_item(self, item):
        self.inventory.add_item(item)

    def remove_item(self, item):
        self.inventory.remove_item(item)

    def print(self):
        print(vars(self))
        print(vars(self.status))
        print(vars(self.equipment))
        print(vars(self.inventory))
