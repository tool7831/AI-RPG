import HealthIcon from '@mui/icons-material/Favorite'; // 예시 아이콘
import StaminaIcon from '@mui/icons-material/FitnessCenter'; // 예시 아이콘
import ManaIcon from '@mui/icons-material/Opacity'; // 예시 아이콘
import { StatusEffectType } from '../scripts/status.ts';

// 키에 따른 아이콘 매핑
export const statIcons = {
  hp: <HealthIcon/>,
  mp: <ManaIcon/>,
  // shield:
  // strength:
  // dexterity:
  // intelligence:
  // luck:
  // defense:
  // speed:
  // concentration:
  // reaction:
  // hp_regeneration:
  // mp_regeneration:
};

export const statusEffectIcons = {
  Burn: <img src='statusEffects/burn.png' width={40} height={40}/>,
  Poison: <img src='statusEffects/poison.png' width={40} height={40}/>,
  Bleed: <img src='statusEffects/bleed.png' width={40} height={40}/>,
  Stun: "Stun",
  Freeze: "Freeze",
  Paralysis: "Paralysis",
  Sleep: "Sleep",
  Confusion: "Confusion",
  Blindness: "Blindness",
  Charm: "Charm",
  Fear: "Fear",
  Weaken: "Weaken"
};
