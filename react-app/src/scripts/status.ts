
export interface StatusData {
    HP: number,
    MP: number,
    Strength: number,
    Skill: number,
    Dexterity: number,
    Intelligence: number,
    Luck: number,
    Defense: number,
    Speed: number,
    Concentration: number,
    Reaction: 0,
    HP_Regeneration: number,
    MP_Regeneration: number
};

interface StatusDict {
    status: StatusData;
    max_status: StatusData;
    added_status: StatusData;
}

export class Status {
    public status: StatusData;
    public max_status: StatusData;
    public added_status: StatusData;
    public durable: any[];

    constructor(status: StatusData) {
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

    getStatus(): StatusData {
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
