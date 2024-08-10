from typing import Dict, Any

# StatusEffect class
class StatusEffect:
    def __init__(self, effect_type: str, duration: int, default_value: int, coef: Dict[str, int], accuracy: int):
        self.type = effect_type
        self.duration = duration
        self.default_value = default_value
        self.coef = coef
        self.accuracy = accuracy

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "duration": self.duration,
            "defaultValue": self.default_value,
            "coef": self.coef,
            "accuracy": self.accuracy
        }

# Attack class
class Attack:
    def __init__(self, name: str, attack_type: str, default_damage: int, coef: Dict[str, int], count: int, 
                 penetration: int, accuracy: int, cooldown: int, status_effect: StatusEffect):
        self.name = name
        self.type = attack_type
        self.default_damage = default_damage
        self.coef = coef
        self.count = count
        self.penetration = penetration
        self.accuracy = accuracy
        self.cooldown = cooldown
        self.status_effect = status_effect
        self.cur_cooldown = 0

    def do_attack(self, stats: Dict[str, Any]) -> Dict[str, Any]:
        total_damage = self.default_damage

        for key, value in self.coef.items():
            total_damage += stats.get(key, 0) * value

        self.cur_cooldown += self.cooldown

        return {
            "type": self.type,
            "damage": total_damage,
            "count": self.count,
            "penetration": self.penetration,
            "accuracy": self.accuracy,
            "statusEffect": self.status_effect.to_dict(),
        }

    def is_available(self) -> bool:
        return self.cur_cooldown == 0

    def reduce_cooldown(self, value: int) -> None:
        self.cur_cooldown = max(self.cur_cooldown - value, 0)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.type,
            "defaultDamage": self.default_damage,
            "coef": self.coef,
            "count": self.count,
            "penetration": self.penetration,
            "accuracy": self.accuracy,
            "cooldown": self.cooldown,
            "statusEffect": self.status_effect.to_dict(),
            "curCooldown": self.cur_cooldown
        }

# Defend class
class Defend:
    def __init__(self, name: str, defend_type: str, default_value: int, coef: Dict[str, int], duration: int, cooldown: int):
        self.name = name
        self.type = defend_type
        self.default_value = default_value
        self.coef = coef
        self.duration = duration
        self.cooldown = cooldown
        self.cur_cooldown = 0

    def do_defend(self, stats: Dict[str, Any]) -> Dict[str, Any]:
        total_value = self.default_value

        for key, value in self.coef.items():
            total_value += stats.get(key, 0) * value

        self.cur_cooldown += self.cooldown

        return {
            "type": self.type,
            "value": total_value,
        }

    def is_available(self) -> bool:
        return self.cur_cooldown == 0

    def reduce_cooldown(self, value: int) -> None:
        self.cur_cooldown = max(self.cur_cooldown - value, 0)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.type,
            "defaultValue": self.default_value,
            "coef": self.coef,
            "duration": self.duration,
            "cooldown": self.cooldown,
            "curCooldown": self.cur_cooldown
        }
