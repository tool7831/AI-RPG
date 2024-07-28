from Status import Status
from Item import Item

class Enemy():
    def __init__(self, enemy):
        self.name = enemy['Monster Name']
        self.description = enemy['Monster Description']
        self.reward = enemy['Reward']
        self.status = Status(enemy['Status'])
        self.item = Item(enemy['Item'])

    def attack(self):
        return 
    
    def block(self):
        return

    def die(self):
        return self.reward, self.item