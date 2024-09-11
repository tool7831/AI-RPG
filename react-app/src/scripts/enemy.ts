import { Attack, Defend, Smite, AttackData, DefendData, SmiteData } from './skill.ts'
import { Status, StatusData } from './status.ts';

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Enemy {
    public name: string;
    public description: string;
    public status: Status;
    public attacks: Attack[];
    public defends: Defend[];
    public smites: Smite[];
    private frequency: Record<string, any>;

    constructor(name: string, description: string, statusData: StatusData, attacks: AttackData[], defends: DefendData[], smites: SmiteData[], frequency: Record<string, any>) {
        this.name = name;
        this.description = description;
        this.status = Status.init(statusData);
        this.attacks = attacks.map(atk => new Attack(atk));
        this.defends = defends.map(def => new Defend(def));
        this.smites = smites.map(smi => new Smite(smi));
        this.frequency = this.adjustTo100(frequency);
    }

    private adjustTo100(frequency: Record<string, any>) {
        const entries = Object.entries(frequency);
        // 1. 모든 값의 합 계산
        const total = entries.reduce((sum, [key, values]) => {
            return sum + values.reduce((acc, value) => acc + value, 0);
        }, 0);
        // 2. 각 값을 전체 합에 대한 비율로 곱해 조정
        let adjustedTotal = 0;
        const adjustedObj = {};
        for (let [key, values] of entries) {
            adjustedObj[key] = values.map(value => {
                const adjustedValue = Math.round((value / total) * 100);
                adjustedTotal += adjustedValue;
                return adjustedValue;
            });
        }
        // 3. 부동소수점 문제로 인해 총합이 100이 아닐 경우 조정
        let difference = 100 - adjustedTotal;
        if (difference !== 0) {
            for (let [key, values] of entries) {
                for (let i = 0; i < values.length && difference !== 0; i++) {
                    adjustedObj[key][i] += difference > 0 ? 1 : -1;
                    difference += difference > 0 ? -1 : 1;
                }
            }
        }
        return adjustedObj;
    }

    doAction() {
        this.reduceCoolDown(1)
        this.canAction()
        this.status.updateStatusEffects()
        this.status.updateBuffs()
        while (this.status.isActionAvailable) {
            let flag = false
            const action = rand(0, 99)
            let cumulative = 0;
            for (let [key, values] of Object.entries(this.frequency)) {
                if (flag) break;
                for (let i = 0; i < values.length; i++) {
                    cumulative += values[i];
                    if (action < cumulative) {
                        if (key === 'attacks') {
                            if (!this.attacks[i].isAvailable()) {
                                flag = true;
                                break;
                            }
                            return {
                                action: 0,
                                skill: this.doAttack(i)
                            }
                        } 
                        else if (key === 'defends') {
                            if (!this.defends[i].isAvailable()){
                                flag = true;
                                break;
                            }
                            return {
                                action: 1,
                                skill: this.doDefend(i)
                            }
                        }
                        else {
                            if (!this.smites[i].isAvailable()){
                                flag = true;
                                break;
                            }
                            return {
                                action: 2,
                                skill: this.doSmite(i)
                            }
                        }
                    }
                }
            }
        }
        this.endTurn()
        return {
            action: 4,
            skill: null
        }
    }

    doAttack(idx: number): Record<string, any> {
        return this.attacks[idx].doAttack(this.status.status);
    }

    doDefend(idx: number): Record<string, any> {
        return this.defends[idx].doDefend(this.status.status);
    }

    doSmite(idx: number): Record<string, any> {
        return this.smites[idx].doSmite(this.status.status);
    }

    damaged(skill) {
        for(let i = 0; i < skill.count; i++){
            const attack_rand = rand(0,99)
            if (attack_rand < skill.accuracy) {
                console.log('damage')
                this.status.damaged(skill.damage)
                const effect_rand = rand(0,99)
                if (effect_rand < skill.statusEffect.accuracy) {
                    const statusEffect = {name: skill.name, type: skill.statusEffect.type, value: skill.statusEffect.value, duration : skill.statusEffect.duration}
                    this.status.addStatusEffect(statusEffect)
                }
            }
            else {
                console.log('miss')
            }
        }
    }


    canAction(): void {
        console.log('canAction')
        const atk = this.attacks.filter((atk) => atk.isAvailable())
        const def = this.defends.filter((def) => def.isAvailable())
        const smi = this.smites.filter((smi) => smi.isAvailable())
        console.log(atk, def, smi)
        const len = atk.length + def.length + smi.length 
        if (len === 0)
            this.status.isActionAvailable = false
    }

    endTurn(): void {
        this.status.isActionAvailable = true
    }

    reduceCoolDown(value: number) {
        this.attacks.forEach((atk) => atk.reduceCooldown(value))
        this.defends.forEach((def) => def.reduceCooldown(value))
        this.smites.forEach((smi) => smi.reduceCooldown(value))
    }

    isDead(): boolean {
        return this.status.status.HP <= 0
    }

    toDict(): Record<string, any> {
        return {
            name: this.name,
            description: this.description,
            status: this.status.toDict()
        };
    }

    static fromJSON(json: { name: string; description: string; status: StatusData, attacks: AttackData[], defends: DefendData[], smites: SmiteData[], frequency: Record<string, any> }) {
        return new Enemy(json.name, json.description, json.status, json.attacks, json.defends, json.smites, json.frequency);
    }
}
