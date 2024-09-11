import { Attack, Defend, Smite, AttackData, DefendData, SmiteData } from './skill.ts'
import { Status, StatusData } from './status.ts';

export default class Enemy {
    public name: string;
    public description: string;
    public status: Status;
    public attacks: Attack[];
    public defends: Defend[];
    public smites: Smite[];
    private frequency: Record<string, any>

    constructor(name: string, description: string, statusData: StatusData, attacks: AttackData[], defends: DefendData[], smites: SmiteData[], frequency: Record<string, any>) {
        this.name = name;
        this.description = description;
        this.status = Status.init(statusData);
        this.attacks = attacks.map(atk => new Attack(atk))
        this.defends = defends.map(def => new Defend(def))
        this.smites = smites.map(smi => new Smite(smi))
        this.frequency = this.adjustTo100(frequency)
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

    private rand(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    doAction() {
        const action = this.rand(0, 99)
        let cumulative = 0;
        for (let [key, values] of Object.entries(this.frequency)) {
            for (let i = 0; i < values.length; i++) {
                cumulative += values[i];
                if (action < cumulative) {
                    if (key === 'attacks') {
                        return { 
                            action:0,
                            skill: this.doAttack(i) 
                        }
                    }
                    else if (key === 'defends') {
                        return { 
                            action:1,
                            skill: this.doDefend(i) 
                        }
                    }
                    else {
                        return { 
                            action:2,
                            skill: this.doSmite(i) 
                        }
                    }
                }
            }
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

    toDict(): Record<string, any> {
        return {
            name: this.name,
            description: this.description,
            status: this.status.toDict()
        };
    }

    static fromJSON(json: { name: string; description: string; status: StatusData, attacks: AttackData[], defends: DefendData[], smites:SmiteData[], frequency: Record<string, any> }) {
        return new Enemy(json.name, json.description, json.status, json.attacks, json.defends, json.smites, json.frequency);
    }
}
