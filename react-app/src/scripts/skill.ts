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

    doAttack(stats: Record<string, any>): Record<string, any> {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)){
            totalValue += stats[key] * value;
        }
        return {
            type: this.type,
            duration: this.duration,
            value: totalValue, 
            accuracy: this.accuracy
        }
    }

    getTotalValue(stats: Record<string, any>): number {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)){
            totalValue += stats[key] * value;
        }
        return totalValue;
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


export interface AttackData {
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

    doAttack(stats: Record<string, any>): Record<string, any> {
        let totalDamage = this.defaultDamage;

        for (const [key, value] of Object.entries(this.coef)){
            totalDamage += stats[key] * value;
        }

        this.curCooldown += this.cooldown;

        return {
            name: this.name,
            type: this.type,
            damage: totalDamage,
            count: this.count,
            penetration: this.penetration,
            accuracy: this.accuracy,
            statusEffect: this.statusEffect.doAttack(stats),
        };
    }

    getTotalDamage(stats: Record<string, any>): number {
        let totalDamage = this.defaultDamage;

        for (const [key, value] of Object.entries(this.coef)){
            totalDamage += stats[key] * value;
        }
        return totalDamage;
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

export interface DefendData {
    name: string;
    type: string;
    defaultValue:number;
    coef: Record<string, number>;
    duration: number;
    cooldown: number;
    curCooldown: number;
}

export class Defend {
    name: string;
    type: string; // defense up, shield, dodge
    defaultValue:number;
    coef: Record<string, number>;
    duration: number;
    cooldown: number;
    
    private curCooldown: number;

    constructor(data: DefendData) {
        this.name = data.name;
        this.type = data.type;
        this.defaultValue = data.defaultValue;
        this.coef = data.coef;
        this.duration = data.duration;
        this.cooldown = data.cooldown;
        this.curCooldown = 0;
    }

    doDefend(stats: Record<string, any>): Record<string, any> {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)) {
            totalValue += stats[key] * value;
        }
        this.curCooldown += this.cooldown;
        return {
            name: this.name,
            type: this.type,
            value: totalValue,
            duration: this.duration,
        };
    }

    isAvailable(): boolean {
        return this.curCooldown === 0;
    }

    reduceCooldown(value: number): void {
        this.curCooldown = this.curCooldown - value >= 0 ? this.curCooldown - value : 0;
    }

    getTotalValue(stats: Record<string, any>): number {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)) {
            totalValue += stats[key] * value;
        }
        return totalValue;
    }

    toDict(): DefendData {
        return {
            name: this.name,
            type: this.type,
            defaultValue: this.defaultValue,
            coef: this.coef,
            duration: this.duration,
            cooldown: this.cooldown,
            curCooldown: this.curCooldown
        };
    }
}

export interface SmiteData {
    name: string;
    type: string;
    defaultValue:number;
    coef: Record<string, number>;
    duration: number;
    cooldown: number;
    curCooldown: number;
}

export class Smite {
    name: string;
    type: string; // hp_scailing, damage, stun
    defaultValue:number;
    coef: Record<string, number>;
    duration: number;
    cooldown: number;
    
    private curCooldown: number;

    constructor(data: SmiteData) {
        this.name = data.name;
        this.type = data.type;
        this.defaultValue = data.defaultValue;
        this.coef = data.coef;
        this.duration = data.duration;
        this.cooldown = data.cooldown;
        this.curCooldown = 0;
    }

    doSmite(stats: Record<string, any>): Record<string, any> {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)) {
            totalValue += stats[key] * value;
        }
        this.curCooldown += this.cooldown;
        return {
            name: this.name,
            type: this.type,
            value: totalValue,
            duration: this.duration,
        };
    }

    isAvailable(): boolean {
        return this.curCooldown === 0;
    }

    reduceCooldown(value: number): void {
        this.curCooldown = this.curCooldown - value >= 0 ? this.curCooldown - value : 0;
    }

    getTotalValue(stats: Record<string, any>): number {
        let totalValue = this.defaultValue;
        for (const [key, value] of Object.entries(this.coef)) {
            totalValue += stats[key] * value;
        }
        return totalValue;
    }
    
    toDict(): SmiteData {
        return {
            name: this.name,
            type: this.type,
            defaultValue: this.defaultValue,
            coef: this.coef,
            duration: this.duration,
            cooldown: this.cooldown,
            curCooldown: this.curCooldown
        };
    }
}

