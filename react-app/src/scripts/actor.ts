import { Attack, Defend, Smite, AttackData, DefendData, SmiteData } from './skill.ts'
import { Status, StatusData } from './status.ts';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Actor {
  public name: string;
  public description: string;
  public status: Status;
  public attacks: Attack[];
  public defends: Defend[];
  public smites: Smite[];

  constructor(name: string, description: string, attacks: AttackData[], defends: DefendData[], smites: SmiteData[]) {
    this.name = name;
    this.description = description;
    this.attacks = attacks.map(atk => new Attack(atk));
    this.defends = defends.map(def => new Defend(def));
    this.smites = smites.map(smi => new Smite(smi));
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

  damaged(skill: Record<string, any>) {
    for (let i = 0; i < skill.count; i++) {
      const attack_rand = rand(0, 99)
      if (attack_rand < skill.accuracy) {
        console.log('damage')
        this.status.damaged(skill.damage, skill.type)
        if (skill.statusEffect) {
          const effect_rand = rand(0, 99)
          if (effect_rand < skill.statusEffect.accuracy) {
            const statusEffect = { name: skill.name, type: skill.statusEffect.type, value: skill.statusEffect.value, duration: skill.statusEffect.duration }
            this.status.addStatusEffect(statusEffect)
          }
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
    return this.status.isDead()
  }
}
