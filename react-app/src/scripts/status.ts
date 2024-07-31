interface StatusDict {
    status: Record<string, number>;
    max_status: Record<string, number>;
    added_status: Record<string, number>;
}

export class Status {
    public status: Record<string, number>;
    public max_status: Record<string, number>;
    public added_status: Record<string, number>;
    public durable: any[];

    constructor(status: Record<string, number>) {
        this.status = status;
        this.max_status = { ...status };
        this.added_status = {
            HP: 0,
            MP: 0,
            Strength: 0,
            Skill: 0,
            Dexterity: 0,
            Intelligence: 0,
            Luck: 0,
            Defense: 0,
            Speed: 0,
            Concentration: 0,
            Reaction: 0,
            HP_Regeneration: 0,
            MP_Regeneration: 0
        };
        this.durable = [];
    }

    changeMaxValue(name: string, value: number): void {
        if (this.max_status.hasOwnProperty(name) && this.status.hasOwnProperty(name)) {
            this.max_status[name] += value;
            this.status[name] += value;
        }
    }

    getStatus(): Record<string, number> {
        return this.status;
    }

    changeAddedValue(name: string, value: number): void {
        if (this.added_status.hasOwnProperty(name) && this.status.hasOwnProperty(name)) {
            this.added_status[name] += value;
            this.status[name] += value;
        }
    }

    changeHP(value: number): void {
        this.status['HP'] += value;
        if (this.status['HP'] > this.max_status['HP'] + this.added_status['HP']) {
            this.status['HP'] = this.max_status['HP'] + this.added_status['HP'];
        }
    }

    toDict(): StatusDict {
        return {
            status: this.status,
            max_status: this.max_status,
            added_status: this.added_status
        };
    }
}
