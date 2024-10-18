import Actor from './actor.ts';
import { AttackData, DefendData, SmiteData } from './skill.ts'
import { Status, StatusData } from './status.ts';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Enemy extends Actor {
  private frequency: Record<string, any>;

  constructor(name: string, description: string, statusData: StatusData, attacks: AttackData[], defends: DefendData[], smites: SmiteData[], frequency: Record<string, any>) {
    super(name, description, attacks, defends, smites);
    this.status = Status.init(statusData);
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
      // eslint-disable-next-line
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
    console.log(adjustedObj);
    return adjustedObj;
  }

  doAction() {
    this.startTurn()
    this.canAction()
    if (this.getActionAvailable()) {
      // 사용 가능한 행동을 저장할 배열
      const availableActions: Record<string, any>[] = [];
    
      // 사용 가능한 공격 스킬 추가
      for (let i = 0; i < this.attacks.length; i++) {
        if (this.attacks[i].isAvailable()) {
          availableActions.push({
            action: 0, // attack
            skill: i,
            weight: this.frequency.attacks[i] || 0 // 가중치
          });
        }
      }
    
      // 사용 가능한 방어 스킬 추가
      for (let i = 0; i < this.defends.length; i++) {
        if (this.defends[i].isAvailable()) {
          availableActions.push({
            action: 1, // defend
            skill: i,
            weight: this.frequency.defends[i] || 0 // 가중치
          });
        }
      }
    
      // 사용 가능한 스미트 스킬 추가
      for (let i = 0; i < this.smites.length; i++) {
        if (this.smites[i].isAvailable()) {
          availableActions.push({
            action: 2, // smite
            skill: i,
            weight: this.frequency.smites[i] || 0 // 가중치
          });
        }
      }
    
      // 가중치에 따라 랜덤으로 선택
      if (availableActions.length > 0) {
        const totalWeight = availableActions.reduce((sum, action) => sum + action.weight, 0);
        const randValue = rand(0, totalWeight - 1);
        let cumulative = 0;
    
        for (const action of availableActions) {
          cumulative += action.weight;
          if (randValue < cumulative) {
            if (action.action === 0) {
              return {
                action: action.action,
                skill: this.doAttack(action.skill)
              };
            }
            else if (action.action === 1) {
              return {
                action: action.action,
                skill: this.doDefend(action.skill)
              };
            }
            else if (action.action === 2) {
              return {
                action: action.action,
                skill: this.doSmite(action.skill)
              };
            }
          }
        }
      }
    }
    return {
      action: 4,
      skill: { name: 'skip' }
    }
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
