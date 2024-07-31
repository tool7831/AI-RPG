// "Bleed", "Poison", "Burn" -> DoT
// "Freeze" -> DoT & CC
// "Stun", "Paralysis", "Sleep" -> CC
// "Silence", "Confusion", "Blindness", "Weaken" -> Debuff

interface StatusEffectData {
    type: string;
    duration: number;
    defaultValue: number; 
    coef: Record<string,number>;
    accuracy: number;
}

class StatusEffect {
    type: string;
    duration: number;
    defaultValue: number; 
    coef: Record<string,number>;
    accuracy: number;

    constructor(data: StatusEffectData){
        this.type = data.type;
        this.defaultValue = data.defaultValue;
        this.coef = data.coef;
        this.accuracy = data.accuracy;
        this.duration = data.duration;
    }

    toDict(): StatusEffectData {
        return {
            type: this.type,
            duration: this.duration,
            defaultValue: this.defaultValue,
            coef: this.coef,
            accuracy: this.accuracy
        }
    }
}

interface AttackData {
    name: string;
    type: string;
    defaultDamage:number;
    coef: Record<string, number>;
    count: number;
    penetration: number;
    accuracy: number;
    cooldown: number;
    statusEffect: StatusEffectData;
    curCooldown: number;
}

export class Attack {
    name: string;
    type: string;
    defaultDamage:number;
    coef: Record<string, number>;
    count: number;
    penetration: number;
    accuracy: number;
    cooldown: number;
    statusEffect: StatusEffect;
    
    private curCooldown: number;

    constructor(data: AttackData) {
        this.name = data.name;
        this.type = data.type;
        this.defaultDamage = data.defaultDamage;
        this.coef = data.coef;
        this.count = data.count;
        this.penetration = data.penetration;
        this.accuracy = data.accuracy;
        this.cooldown = data.cooldown;
        this.statusEffect = new StatusEffect(data.statusEffect);
        this.curCooldown = 0;
    }

    getAttack(stats: Record<string, any>): Record<string, any> {
        let totalDamage = this.defaultDamage;

        for (const [key, value] of Object.entries(this.coef)){
            totalDamage += stats[key] * value;
        }

        this.curCooldown += this.cooldown;

        return {
            type: this.type,
            damage: totalDamage,
            count: this.count,
            penetration: this.penetration,
            accuracy: this.accuracy,
            statusEffect: this.statusEffect,
        };
    }

    isAvailable(): boolean {
        return this.curCooldown === 0;
    }

    reduceCooldown(value: number): void {
        this.curCooldown = this.curCooldown - value >= 0 ? this.curCooldown - value : 0;
    }

    toDict(): AttackData {
        return {
            name: this.name,
            type: this.type,
            defaultDamage: this.defaultDamage,
            coef: this.coef,
            count: this.count,
            penetration: this.penetration,
            accuracy: this.accuracy,
            cooldown: this.cooldown,
            statusEffect: this.statusEffect.toDict(),
            curCooldown: this.curCooldown
        };
    }
}


export class Defend {
    
}