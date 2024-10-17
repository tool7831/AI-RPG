
// 키에 따른 아이콘 매핑
// const statIconSize = 20;
const statIcons = {
  hp: `${process.env.PUBLIC_URL}/stats/hp.png`,
  mp: `${process.env.PUBLIC_URL}/stats/mp.png`,
  shield: `${process.env.PUBLIC_URL}/stats/shield.png`,
  strength: `${process.env.PUBLIC_URL}/stats/strength.png`, 
  dexterity: `${process.env.PUBLIC_URL}/stats/dexterity.png`, 
  intelligence: `${process.env.PUBLIC_URL}/stats/intelligence.png`,
  luck: `${process.env.PUBLIC_URL}/stats/luck.png`,
  defense: `${process.env.PUBLIC_URL}/stats/defense.png`,
  agility: `${process.env.PUBLIC_URL}/stats/speed.png`, 
  resistance: `${process.env.PUBLIC_URL}/stats/resistance.png`, 
  toughness: `${process.env.PUBLIC_URL}/stats/toughness.png`, 
  hp_regeneration: `${process.env.PUBLIC_URL}/stats/hp_regeneration.png`,
  // mp_regeneration:
};

const statusEffectIcons = {
  Burn: `${process.env.PUBLIC_URL}/statusEffects/burn.png`,
  Poison: `${process.env.PUBLIC_URL}/statusEffects/poison.png`,
  Bleed: `${process.env.PUBLIC_URL}/statusEffects/bleed.png`,
  Stun: `${process.env.PUBLIC_URL}/statusEffects/stun.png`,
  Freeze: `${process.env.PUBLIC_URL}/statusEffects/freeze.png`,
  Paralysis: `${process.env.PUBLIC_URL}/statusEffects/paralysis.png`,
  Sleep: `${process.env.PUBLIC_URL}/statusEffects/sleep.png`,
  Confusion: `${process.env.PUBLIC_URL}/statusEffects/confusion.png`,
  Blindness: `${process.env.PUBLIC_URL}/statusEffects/blindness.png`,
  Charm: `${process.env.PUBLIC_URL}/statusEffects/charm.png`,
  Fear: `${process.env.PUBLIC_URL}/statusEffects/fear.png`,
  Weaken: `${process.env.PUBLIC_URL}/statusEffects/weaken.png`
};

const skillIcons = {
  melee: `${process.env.PUBLIC_URL}/stats/strength.png`,
  magic: `${process.env.PUBLIC_URL}/skills/magic.png`,
  shield: `${process.env.PUBLIC_URL}/stats/shield.png`,
  parry: `${process.env.PUBLIC_URL}/skills/parry.png`,
  dodge: `${process.env.PUBLIC_URL}/skills/dodge.png`,
  damage: `${process.env.PUBLIC_URL}/skills/damage.png`,
  hp_scaling: `${process.env.PUBLIC_URL}/skills/hp_scaling.png`,
  stun: `${process.env.PUBLIC_URL}/skills/stun.png`,
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




