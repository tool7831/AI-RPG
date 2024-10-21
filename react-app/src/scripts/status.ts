import { AttackType, StatusEffectType } from "./skill.ts";

export interface StatusData {
    hp: number,
    mp: number,
    shield: number,
    strength: number,
    dexterity: number,
    intelligence: number,
    agility: number,
    luck: number,
    defense: number,
    resistance: number,
    toughness: number,
    hp_regeneration: number,
    mp_regeneration: number
};

export interface StatusDict {
    status: StatusData;
    origin_status: StatusData;
    added_status: StatusData;
}

interface StatusEffect {
    name: string,
    type: StatusEffectType,
    duration: number,
    value: number,
}

interface Buff {
    name: string,
    type: keyof StatusData,
    duration: number,
    value: number
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Status {
    public origin_status: StatusData;
    public added_status: StatusData;
    public curStatusEffects: StatusEffect[];
    public buffs: Buff[];
    public isActionAvailable: boolean;

    constructor(origin_status: StatusData, added_status: StatusData) {
        this.origin_status = origin_status;
        this.added_status = added_status;
        this.curStatusEffects = [];
        this.buffs = [];
        this.isActionAvailable = true;
    }

    get status(): StatusData {
        let computedStatus: StatusData = { ...this.origin_status };
        for (let key in this.added_status) {
            if (this.added_status.hasOwnProperty(key)) {
                computedStatus[key] += this.added_status[key];
                if (computedStatus[key] < 0) {
                    computedStatus[key] = 0;
                }
            }
        }
        return computedStatus;
    }

    changeOriginValue(name: keyof StatusData, value: number): void {
        value = Math.floor(value)
        if (this.origin_status.hasOwnProperty(name)) {
            this.origin_status[name] += value;
        }
    }

    changeAddedValue(name: keyof StatusData, value: number): void {
        value = Math.floor(value)
        if (this.added_status.hasOwnProperty(name)) {
            this.added_status[name] += value 
        }
    }

    // HP 변경 시 status에 따른 최대 HP를 자동으로 반영
    changeHP(value: number): void {
        value = Math.floor(value)
        this.added_status.hp += value;
        let currentStatus = this.status; // 계산된 상태
        if (this.origin_status.hp < currentStatus.hp) {
            this.added_status.hp = 0;
        }
    }

    changeMP(value: number): void {
        value = Math.floor(value)
        this.added_status.mp += value;
        let currentStatus = this.status; // 계산된 상태
        if (this.origin_status.mp < currentStatus.mp) {
            this.added_status.mp = 0;
        }
    }

    damaged(value: number, attackType: AttackType | null = null, penetration: number = 0): number {
        value = Math.floor(value)
        if (attackType === AttackType.melee) {
            const total_damage = Math.floor(value - this.status.defense * (1 - (penetration / 100)));
            if (total_damage > 0) {
                let remain = this.status.shield - total_damage;
                this.changeAddedValue('shield', -total_damage);
                if (remain < 0) {
                    this.changeHP(remain);
                }
            }
            return total_damage;
        }
        else if (attackType === AttackType.magic) {
            const total_damage = Math.floor(value - this.status.resistance * (1 - (penetration / 100)));
            if (total_damage > 0) {
                let remain = this.status.shield - total_damage;
                this.changeAddedValue('shield', -total_damage);
                if (remain < 0) {
                    this.changeHP(remain);
                }
            }
            return total_damage;
        }
        else {
            const total_damage = Math.floor(value);
            if (total_damage > 0) {
                let remain = this.status.shield - total_damage;
                this.changeAddedValue('shield', -total_damage);
                if (remain < 0) {
                    this.changeHP(remain);
                }
            }
            return total_damage;
        }
        return 0;
    }

    addBuff(buff: Buff) {
        this.changeAddedValue(buff.type, buff.value)
        this.buffs.push(buff);
    } 

    addStatusEffect(statusEffect: StatusEffect) {
        const existingEffect = this.curStatusEffects.find((se) => se.name === statusEffect.name);
        if (existingEffect) {
            // 기존 상태 효과가 있으면 duration만 업데이트
            existingEffect.duration = statusEffect.duration;
        } else {
            // 기존 상태 효과가 없으면 새로운 상태 효과 추가
            if (statusEffect.type === StatusEffectType.Charm) {
                statusEffect.value = -statusEffect.value * this.origin_status.defense
                this.changeAddedValue('defense', statusEffect.value)
            }
            else if (statusEffect.type === StatusEffectType.Weaken) {
                statusEffect.value = -statusEffect.value * this.origin_status.strength
                this.changeAddedValue('strength', statusEffect.value)
            }
            this.curStatusEffects.push(statusEffect);
        }
    }

    updateStatusEffects() {
        this.curStatusEffects = this.curStatusEffects.filter(effect => {
            effect.duration -= 1;
            switch (effect.type) {
                case StatusEffectType.Burn:
                    // Burn: 매 턴마다 피해를 입음
                    this.changeHP(-effect.value);
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Poison:
                    // Poison: 일정 시간 동안 피해를 입음
                    this.changeHP(-effect.value)
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Bleed:
                    // Bleed: 시간이 지날수록 점진적인 피해
                    this.changeHP(-effect.value)
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Freeze:
                    // Freeze: 행동 불가, 매 턴마다 피해
                    this.changeHP(-effect.value);
                    this.isActionAvailable = false;
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Stun:
                    // Stun: 일정 시간 동안 행동 불가
                    this.isActionAvailable = false;
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Paralysis:
                    // Paralysis: 일정 확률로 행동 불가
                    const paralysis = rand(0, 99)
                    if (paralysis < effect.value)
                        this.isActionAvailable = false;
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Sleep:
                    // Sleep: 행동 불가, 공격을 받으면 깨어남
                    this.isActionAvailable = false;
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Fear:
                    // Fear: 행동을 못 함
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Confusion:
                    // Confusion: 일정 확률로 자해 또는 적에게 공격
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Blindness:
                    // Blindness: 적중률 감소
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Charm:
                    // Charm: 방어력 감소
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                case StatusEffectType.Weaken:
                    // Weaken: 공격력 감소
                    if (effect.duration <= 0) {
                        return false;
                    }
                    break;

                default:
                    console.log('알 수 없는 상태 효과: ', effect.type);
                    break;
            }
            return true;
        });
    }

    updateBuffs() {
        this.buffs = this.buffs.filter(buff => {
            buff.duration -= 1;
            if (buff.duration <= 0) {
                this.changeAddedValue(buff.type, -buff.value)
                return false
            }
            return true
        })
    }

    toDict(): StatusDict {
        return {
            status: this.status,
            origin_status: this.origin_status,
            added_status: this.added_status
        };
    }

    isDead(): boolean {
        return this.status.hp <= 0;
    }

    static init(status: StatusData) {
        return new Status({ ...status }, {
            hp: 0,
            mp: 0,
            shield: 0,
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            luck: 0,
            agility: 0,
            defense: 0,
            toughness: 0,
            resistance: 0,
            hp_regeneration: 0,
            mp_regeneration: 0
        })
    }
}
