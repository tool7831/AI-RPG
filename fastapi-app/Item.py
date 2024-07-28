
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
