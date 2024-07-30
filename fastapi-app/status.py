
class Status():
    def __init__(self, status):
        self.status = status
        self.max_status = status
        self.added_status = {'HP': 0, 'MP': 0, 'Strength': 0, 'Skill': 0, 'Dexterity': 0, 'Intelligence': 0, 'Luck': 0, 'Defense': 0, 'Speed': 0, 'Concentration': 0, 'Reaction': 0, 'HP_Regeneration': 0, 'MP_Regeneration': 0}
        self.durable = list()

    def change_max_value(self, name, value):
        self.max_status[name] += value
        self.status[name] += value

    def get_status(self):
        return self.status
    
    def change_added_value(self, name, value):
        self.added_status[name] += value
        self.status[name] += value

    def change_hp(self, value):
        self.status['HP'] += value
        if self.status['HP'] > self.max_status['HP'] + self.added_status['HP']:
            self.status['HP'] = self.max_status['HP'] + self.added_status['HP']


    def to_dict(self):
        return {
            "status": self.status,
            "max_status": self.max_status,
            "added_status": self.added_status
        }