import { Attack, Defend, AttackData, DefendData } from './skill.ts'
import { Status, StatusData } from './status.ts';

export default class Enemy {
    public name: string;
    public description: string;
    public status: Status;
    public attacks: Attack[];
    public defends: Defend[];

    constructor(name: string, description: string, statusData: StatusData, attacks: AttackData[], defends: DefendData[]) {
        this.name = name;
        this.description = description;
        this.status = Status.init(statusData);
        this.attacks = attacks.map(atk => new Attack(atk))
        this.defends = defends.map(def => new Defend(def))
    }

    doAttack(idx:number): Record<string,any> {
        return this.attacks[idx].doAttack(this.status.status); 
    }

    doDefend(idx:number): Record<string,any> {
        return this.defends[idx].doDefend(this.status.status); 
    }

    toDict(): Record<string, any> {
        return {
            name: this.name,
            description: this.description,
            status: this.status.toDict()
        };
    }

    static fromJSON(json: { name: string; description: string; status: StatusData, attacks: AttackData[], defends: DefendData[]}) {
        return new Enemy(json.name, json.description, json.status, json.attacks, json.defends);
    }
}
