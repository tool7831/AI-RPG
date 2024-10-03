
// 키에 따른 아이콘 매핑
// const statIconSize = 20;
const statIcons = {
  hp: 'stats/hp.png', 
  mp: 'stats/mp.png',
  shield:'stats/shield.png',
  strength: 'stats/strength.png', 
  dexterity: 'stats/dexterity.png', 
  intelligence:'stats/intelligence.png',
  luck: 'stats/luck.png',
  defense: 'stats/defense.png',
  speed: 'stats/speed.png', 
  // concentration:
  // reaction:
  hp_regeneration: 'stats/hp_regeneration.png',
  // mp_regeneration:
};

const statusEffectIcons = {
  Burn: 'statusEffects/burn.png',
  Poison: 'statusEffects/poison.png',
  Bleed: 'statusEffects/bleed.png',
  Stun: "statusEffects/stun.png",
  Freeze: "statusEffects/freeze.png",
  Paralysis: "statusEffects/paralysis.png",
  Sleep: "statusEffects/sleep.png",
  Confusion: "statusEffects/confusion.png",
  Blindness: "statusEffects/blindness.png",
  Charm: "statusEffects/charm.png",
  Fear: "statusEffects/fear.png",
  Weaken: "statusEffects/weaken.png"
};

const skillIcons = {
  melee: 'stats/strength.png',
  magic: 'skills/magic.png',
  shield: 'stats/shield.png',
  parry: "skills/parry.png",
  dodge: "skills/dodge.png",
  damage: 'skills/damage.png',
  hp_scailing: 'skills/hp_scailing.png',
  stun: 'skills/stun.png',
};

export function StatIcons({type, style={width:'20px', height:'20px'}}) {
  return statIcons[type] && (
    <img src={statIcons[type]} style={style} alt={type}/>
  )
}

export function StatusEffectIcons({type, style={width:'40px', height:'40px'}}) {

  return statusEffectIcons[type] && (
    <img src={statusEffectIcons[type]} style={style} alt={type}/>
  )
}

export function SkillIcons({type, style={width:'40px', height:'40px'}}) {
  
  return skillIcons[type] && (
    <img src={skillIcons[type]} style={style} alt={type}/>
  )
}




