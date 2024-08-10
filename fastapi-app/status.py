from typing import Dict, List, Any

class StatusData:
    def __init__(self, HP: int, MP: int, Strength: int, Skill: int, Dexterity: int, Intelligence: int, Luck: int, 
                 Defense: int, Speed: int, Concentration: int, Reaction: int = 0, HP_Regeneration: int = 0, MP_Regeneration: int = 0):
        self.HP = HP
        self.MP = MP
        self.Strength = Strength
        self.Skill = Skill
        self.Dexterity = Dexterity
        self.Intelligence = Intelligence
        self.Luck = Luck
        self.Defense = Defense
        self.Speed = Speed
        self.Concentration = Concentration
        self.Reaction = Reaction
        self.HP_Regeneration = HP_Regeneration
        self.MP_Regeneration = MP_Regeneration

    def to_dict(self) -> Dict[str, int]:
        return {
            "HP": self.HP,
            "MP": self.MP,
            "Strength": self.Strength,
            "Skill": self.Skill,
            "Dexterity": self.Dexterity,
            "Intelligence": self.Intelligence,
            "Luck": self.Luck,
            "Defense": self.Defense,
            "Speed": self.Speed,
            "Concentration": self.Concentration,
            "Reaction": self.Reaction,
            "HP_Regeneration": self.HP_Regeneration,
            "MP_Regeneration": self.MP_Regeneration
        }

class Status:
    def __init__(self, status: Dict[str, any], max_status: Dict[str, any], added_status: Dict[str, any]):
        self.status = StatusData(**status)
        self.max_status = StatusData(**max_status)  # Deep copy of the status
        self.added_status = StatusData(**added_status)
        self.durable: List[Any] = []

    def change_max_value(self, name: str, value: int) -> None:
        if hasattr(self.max_status, name) and hasattr(self.status, name):
            setattr(self.max_status, name, getattr(self.max_status, name) + value)
            setattr(self.status, name, getattr(self.status, name) + value)

    def get_status(self) -> StatusData:
        return self.status

    def change_added_value(self, name: str, value: int) -> None:
        if hasattr(self.added_status, name) and hasattr(self.status, name):
            setattr(self.added_status, name, getattr(self.added_status, name) + value)
            setattr(self.status, name, getattr(self.status, name) + value)

    def change_hp(self, value: int) -> None:
        self.status.HP += value
        max_hp = self.max_status.HP + self.added_status.HP
        if self.status.HP > max_hp:
            self.status.HP = max_hp

    def to_dict(self) -> Dict[str, Dict[str, int]]:
        return {
            "status": self.status.to_dict(),
            "max_status": self.max_status.to_dict(),
            "added_status": self.added_status.to_dict()
        }
