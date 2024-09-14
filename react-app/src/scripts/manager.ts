
interface StatusEffect {
    accuracy: number,
    duration: number,
    type: string,
    value: number,
}

export class StatusEffectManager {
    private curStatusEffect: StatusEffect[]

    constructor() {
        this.curStatusEffect = [];
    }

    addStatusEffect(statusEffect: StatusEffect) {
        this.curStatusEffect.push(statusEffect);
    }
    
    doStatusEffect() {
        this.curStatusEffect.forEach((se)=>{
            switch (se.type) {
                case 'Burn':
                    // Burn: 매 턴마다 피해를 입음
                    this.applyBurnEffect(se.value);
                    break;
                    
                case 'Poison':
                    // Poison: 일정 시간 동안 피해를 입음
                    this.applyPoisonEffect(se.value);
                    break;
    
                case 'Bleed':
                    // Bleed: 시간이 지날수록 점진적인 피해
                    this.applyBleedEffect(se.value);
                    break;
    
                case 'Stun':
                    // Stun: 일정 시간 동안 행동 불가
                    this.applyStunEffect();
                    break;
    
                case 'Freeze':
                    // Freeze: 행동 불가, 일정 시간 후 해제
                    this.applyFreezeEffect();
                    break;
    
                case 'Paralysis':
                    // Paralysis: 일정 확률로 행동 불가
                    this.applyParalysisEffect();
                    break;
    
                case 'Sleep':
                    // Sleep: 행동 불가, 공격을 받으면 깨어남
                    this.applySleepEffect();
                    break;
    
                case 'Confusion':
                    // Confusion: 일정 확률로 자해 또는 적에게 공격
                    this.applyConfusionEffect();
                    break;
    
                case 'Blindness':
                    // Blindness: 적중률 감소
                    this.applyBlindnessEffect(se.accuracy);
                    break;
    
                case 'Charm':
                    // Charm: 일정 시간 동안 적이 우호적으로 변함
                    this.applyCharmEffect();
                    break;
    
                case 'Fear':
                    // Fear: 도망가거나 행동을 못 함
                    this.applyFearEffect();
                    break;
    
                case 'Weaken':
                    // Weaken: 공격력 또는 방어력 감소
                    this.applyWeakenEffect(se.value);
                    break;
    
                default:
                    console.log('알 수 없는 상태 효과: ', se.type);
                    break;
            }
        });
    }

    reduceDuration(value: number) {
        this.curStatusEffect = this.curStatusEffect
            .map((se) => {
                se.duration -= value;
                return se;
            })
            .filter((se) => se.duration > 0); 
    }
}