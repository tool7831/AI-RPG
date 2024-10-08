import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBox from '../components/statusBox.js';
import { Container, Box, Button, Typography, List, Grid, ListItemButton, Tabs, Tab, Fade, Modal, Backdrop, ListItem, Paper } from '@mui/material';

import Enemy from '../scripts/enemy.ts'
import Player from '../scripts/player.ts';
import { AttackBox, DefendBox, SmiteBox } from '../components/skillBox.js';
import { SkillIcons } from '../components/icons.js';
import StatusEffectBar from '../components/statusEffectBar.js';
import MenuButton from '../components/menuButton.js'

import './animation.css'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function CombatPage() {
  const [player, setPlayer] = useState();
  const [enemy, setEnemy] = useState();

  const [enemyAction, setEnemyAction] = useState(null);
  const [playerAction, setPlayerAction] = useState(null);
  const [enemyWin, setEnemyWin] = useState(false);
  const [playerWin, setPlayerWin] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedAction, setSeletedAction] = useState(0);
  const [rewards, setRewards] = useState(null);
  const [render, setRender] = useState(0);
  const [victoryModal, setVictoryModal] = useState(false);
  const [defeatModal, setDefeatModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8000/load_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')) {
          setEnemy(Enemy.fromJSON(data.combat));
          setPlayer(Player.fromJSON(data.player));
          setRewards(data.rewards)
        } else {
          console.log('go story page');
          navigate('/story');
        }
      });
  }, []);

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
  };
  const handleActionChange = (event, action) => {
    setSeletedAction(action)
    setSelectedSkill(null)
  };
  const handleConfirmAttack = () => {
    if (selectedSkill !== null) {
      console.log(selectedSkill);
      battle(selectedAction);
      setSelectedSkill(null);
    }
  };
  const handleCancel = () => {
    setSelectedSkill(null);
  };

  const handleVictory = () => {
    setVictoryModal(!victoryModal);
    player.getRewards(rewards);
    const data = {
      player: player.toDict(),
      story: { text: 'Player win ' + enemy.name }
    }
    fetch('http://localhost:8000/story_gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          navigate('/story')
        }
        else {
          console.log(data.success);
        }
      });
  }

  const battle = (player_action) => {
    const e = enemy.doAction();
    const enemy_action = e.action;
    const enemy_skill = e.skill;
    const player_skill = player.doAction(player_action, selectedSkill);

    setEnemyAction(e);
    setPlayerAction({ action: player_action, skill: player_skill });

    console.log('Enemy:', e)
    console.log('Player:', player_action, player_skill)
    if (player_action === 0 && enemy_action === 0) {
      // 둘다 공격
      player.damaged(enemy_skill)
      enemy.damaged(player_skill)
      setEnemyWin(true)
      setPlayerWin(true)
    }
    else if (player_action === 0 && enemy_action === 1) {
      // 공격 패?
      setEnemyWin(true)
      setPlayerWin(false)
      if (enemy_skill.type === 'shield') {
        enemy.status.addBuff(enemy_skill)
        enemy.damaged(player_skill)
      }
      else if (enemy_skill.type === 'parry') {
        for (let i = 0; i < player_skill.count; i++) {
          const parry_rand = rand(0, 99)
          const parry = { ...player_skill, 'count': 1 }
          if (enemy_skill.value < parry_rand) {
            console.log("parry_success")
            player.damaged(parry)
          }
          else {
            console.log("parry_fail")
            enemy.damaged(parry)
          }
        }
      }
      else if (enemy_skill.type === 'dodge') {
        for (let i = 0; i < player_skill.count; i++) {
          const dodge_rand = rand(0, 99)
          const dodge = { ...player_skill, 'count': 1 }
          if (enemy_skill.value >= dodge_rand) {
            console.log('dodge_fail')
            enemy.damaged(dodge)
          }
          else {
            console.log('dodge_success')
          }
        }
      }
    }
    else if (player_action === 0 && enemy_action === 2) {
      // 공격 승
      setEnemyWin(false)
      setPlayerWin(true)
      enemy.damaged(player_skill)
    }
    else if (player_action === 1 && enemy_action === 0) {
      // 방어 승?
      setEnemyWin(false)
      setPlayerWin(true)
      if (player_skill.type === 'shield') {
        player.status.addBuff(player_skill)
        player.damaged(enemy_skill)
      }
      else if (player_skill.type === 'parry') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const parry_rand = rand(0, 99)
          const attack = { ...enemy_skill, 'count': 1 }
          if (player_skill.value < parry_rand) {
            console.log("parry_success")
            enemy.damaged(attack)
          }
          else {
            console.log("parry_fail")
            player.damaged(attack)
          }
        }
      }
      else if (player_skill.type === 'dodge') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const dodge_rand = rand(0, 99)
          const attack = { ...enemy_skill, 'count': 1 }
          if (player_skill.value >= dodge_rand) {
            console.log('dodge_fail')
            player.damaged(attack)
          }
          else {
            console.log('dodge_success')
          }
        }
      }
    }
    else if (player_action === 1 && enemy_action === 1) {
      // 무시
      setEnemyWin(true)
      setPlayerWin(true)
      if (player_skill.type === 'shield') {
        player.status.addBuff(player_skill)
      }
      if (enemy_skill.type === 'shield') {
        enemy.status.addBuff(enemy_skill)
      }
    }
    else if (player_action === 1 && enemy_action === 2) {
      // 방어 패
      setEnemyWin(true)
      setPlayerWin(false)
      if (enemy_skill.type === 'hp_scailing') {
        player.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))
      }
      else if (enemy_skill.type === 'damage') {
        player.damaged(enemy_skill.value)
      }
      else if (enemy_skill.type === 'stun') {
        player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration })
      }
    }
    else if (player_action === 2 && enemy_action === 0) {
      // 강타 패
      setEnemyWin(true)
      setPlayerWin(false)
      player.damaged(enemy_skill)
    }
    else if (player_action === 2 && enemy_action === 1) {
      // 강타 숭
      setEnemyWin(false)
      setPlayerWin(true)
      if (player_skill.type === 'hp_scailing') {
        enemy.damaged(enemy.status.origin_status.HP * player_skill.value / 100)
      }
      else if (enemy_skill.type === 'damage') {
        enemy.damaged(player_skill.value)
      }
      else if (player_skill.type === 'stun') {
        enemy.status.addStatusEffect({ name: player_skill.name, type: 'Stun', value: 0, duration: player_skill.duration })
      }
    }
    else if (player_action === 2 && enemy_action === 2) {
      // 스탯 강한 쪽 승
      if (player_skill.value > enemy_skill.value) {
        setEnemyWin(false)
        setPlayerWin(true)
        if (player_skill.type === 'hp_scailing') {
          enemy.damaged(Math.floor(enemy.status.origin_status.HP * player_skill.value / 100))
        }
        else if (enemy_skill.type === 'damage') {
          enemy.damaged(player_skill.value)
        }
        else if (player_skill.type === 'stun') {
          enemy.status.addStatusEffect({ name: player_skill.name, type: 'Stun', value: 0, duration: player_skill.duration })
        }
      }
      else if (player_skill.value < enemy_skill.value) {
        setEnemyWin(true)
        setPlayerWin(false)
        if (enemy_skill.type === 'hp_scailing') {
          player.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))
        }
        else if (enemy_skill.type === 'damage') {
          player.damaged(enemy_skill.value)
        }
        else if (enemy_skill.type === 'stun') {
          player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration })
        }
      }
      else {
        console.log('draw')
      }
    }
    else if (player_action === 4) {
      setEnemyWin(true)
      setPlayerWin(false)
      if (enemy_action === 0)
        player.damaged(enemy_skill)
      else if (enemy_action === 1)
        if (enemy_skill.type === 'shield')
          enemy.status.addBuff(enemy_skill)
        else if (enemy_action === 2) {
          if (enemy_skill.type === 'hp_scailing') {
            player.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))
          }
          else if (enemy_skill.type === 'damage') {
            player.damaged(enemy_skill.value)
          }
          else if (enemy_skill.type === 'stun') {
            player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration })
          }
        }
    }
    else if (enemy_action === 4) {
      setEnemyWin(false)
      setPlayerWin(true)
      if (player_action === 0)
        enemy.damaged(player_skill)
      else if (player_action === 1)
        if (player_skill.type === 'shield')
          player.status.addBuff(player_skill)
        else if (player_action === 2) {
          if (player_skill.type === 'hp_scailing') {
            enemy.damaged(Math.floor(enemy.status.origin_status.HP * player_skill.value / 100))
          }
          else if (enemy_skill.type === 'damage') {
            enemy.damaged(player_skill.value)
          }
          else if (player_skill.type === 'stun') {
            enemy.status.addStatusEffect({ name: player_skill.name, type: 'Stun', value: 0, duration: player_skill.duration })
          }
        }
    }

    setRender(render + 1)
    console.log('Player:', player.status.curStatusEffects)
    console.log('Enemy:', enemy.status.curStatusEffects)
    if (enemy.isDead()) {
      console.log('dead')
      setVictoryModal(true)
    }
    else if (player.isDead()) {
      console.log('player dead')
      setDefeatModal(true)
    }
    // Battle logic here
  };

  const renderSkills = (skills) => (
    <Box sx={{ border: 'solid', padding: '10px' }}>
      <List>
        {selectedSkill === null && skills.map((skill, index) => (
          <ListItemButton key={index} onClick={() => handleSkillSelect(index)} disabled={skill.curCooldown !== 0} >
            <Typography mr={1}>{skill.name}</Typography>
            <SkillIcons type={skill.type} style={{ width: '20px', height: '20px' }} />
            {selectedAction === 0 && <Typography ml={1}>{skill.getTotalDamage(player.status.status)}x{skill.count}</Typography>}
            {selectedAction === 1 && <Typography ml={1}>{skill.getTotalValue(player.status.status)}</Typography>}
            {selectedAction === 2 && <Typography ml={1}>{skill.getTotalValue(player.status.status)}</Typography>}
            <Typography ml={1} variant="body2" color="textSecondary"> ({skill.curCooldown})</Typography>
          </ListItemButton>
        ))}
      </List>
      {selectedSkill !== null && selectedAction === 0 && (
        <Box sx={{ mt: 2 }}>
          <AttackBox skill={player.attacks[selectedSkill]} status={player.status.status} sx={{ padding: '10px' }} />
          <Button onClick={handleConfirmAttack} sx={{ mt: 2 }}>Confirm</Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>Cancel</Button>
        </Box>
      )}
      {selectedSkill !== null && selectedAction === 1 && (
        <Box sx={{ mt: 2 }}>
          <DefendBox skill={player.defends[selectedSkill]} status={player.status.status} sx={{ padding: '10px' }} />
          <Button onClick={handleConfirmAttack} sx={{ mt: 2 }}>Confirm</Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>Cancel</Button>
        </Box>
      )}
      {selectedSkill !== null && selectedAction === 2 && (
        <Box sx={{ mt: 2 }}>
          <SmiteBox skill={player.smites[selectedSkill]} status={player.status.status} sx={{ padding: '10px' }} />
          <Button onClick={handleConfirmAttack} sx={{ mt: 2 }}>Confirm</Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>Cancel</Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Container sx={{ backgroundColor: 'whitesmoke' }}>
      {/* 적 */}
      {enemy && (<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', border: 'solid', padding: '10px' }}>
        <Paper>
          <img src='monster_sample.png' width={300} height={300} style={{ border: '1px solid' }} />
          <Typography variant='h5' sx={{ textAlign: 'center' }}>{enemy.name}</Typography>
        </Paper>
        <div style={{ border: '1px solid #ddd' }}>
          <StatusBox actor={enemy} />
          <StatusEffectBar actor={enemy} />
        </div>
      </Box>
      )}

      {/* 행동 */}
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '100px', border: '1px solid' }}>
        <Grid container>
          <Grid item xs={6} sx={{ display: 'flex', border: '1px solid', flexGrow: '1', justifyContent: 'center', alignItems: 'center' }}>
            <Paper
              elevation={enemyWin ? 4 : 1}
              sx={{
                border: enemyWin ? '2px solid #3f51b5' : '1px solid #ddd',
                width: '90%', height: '90%',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h5' mr={1}>{enemyAction?.skill.name}</Typography>
                <SkillIcons type={enemyAction?.skill.type} style={{ width: '30px', height: '30px' }} />
                {enemyAction?.action === 0 && <Typography variant='h5' ml={1}>{enemyAction?.skill.damage}x{enemyAction?.skill.count}</Typography>}
                {enemyAction?.action === 1 && <Typography variant='h5' ml={1}>{enemyAction?.skill.value}</Typography>}
                {enemyAction?.action === 2 && <Typography variant='h5' ml={1}>{enemyAction?.skill.value}</Typography>}
              </Box>
              <Typography>Action Type: {enemyAction?.action}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', border: '1px solid', flexGrow: '1', justifyContent: 'center', alignItems: 'center' }}>
          <Paper
              elevation={playerWin ? 4 : 1}
              sx={{
                border: playerWin ? '2px solid #3f51b5' : '1px solid #ddd',
                width: '90%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h5' mr={1}>{playerAction?.skill.name}</Typography>
                <SkillIcons type={playerAction?.skill.type} style={{ width: '30px', height: '30px' }} />
                {playerAction?.action === 0 && <Typography variant='h5' ml={1}>{playerAction?.skill.damage}x{playerAction?.skill.count}</Typography>}
                {playerAction?.action === 1 && <Typography variant='h5' ml={1}>{playerAction?.skill.value}</Typography>}
                {playerAction?.action === 2 && <Typography variant='h5' ml={1}>{playerAction?.skill.value}</Typography>}
              </Box>
              <Typography>Action Type: {playerAction?.action}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 플레이어 */}
      <Box sx={{ border: 'solid' }}>
        <Grid container spacing={2}>
          {/* 스킬 */}
          <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tabs value={selectedAction} onChange={handleActionChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                  <Tab value={0} label='attack' />
                  <Tab value={1} label='defend' />
                  <Tab value={2} label='smite' />
                </Tabs>
              </Box>
              <Box>
                {selectedAction === 0 && player && renderSkills(player.attacks)}
                {selectedAction === 1 && player && renderSkills(player.defends)}
                {selectedAction === 2 && player && renderSkills(player.smites)}
              </Box>
            </Box>
            <Box>
              <Button variant='contained' onClick={() => { battle(4); setSelectedSkill(null); }}>Skip</Button>
            </Box>
          </Grid>
          {/* 상태창 */}
          <Grid item xs={6}>
            {player && (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <StatusEffectBar actor={player} />
                <MenuButton actor={player} onClose={() => setRender(render + 1)} />
              </Box>
            )}
            {player && (<StatusBox actor={player} isPlayer={true} />)}
          </Grid>
        </Grid>
      </Box>

      <Modal open={victoryModal} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500, }, }}>
        <Fade in={victoryModal}>
          <Box sx={style}>
            <Typography variant="h6" component="h2">Victory</Typography>
            <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>Exp: {rewards?.exp}</Typography>
              <Typography>Gold: {rewards?.gold}</Typography>
              {rewards?.items.map((item) => {
                return (
                  <div>
                    <Typography>{item?.name}</Typography>
                    {/* <Typography>{item?.description}</Typography>
                    {item && Object.keys(item?.effects).map((stat) =>
                      <Typography color="textSecondary" key={stat}>{stat}: {item?.effects[stat]}</Typography>
                    )} */}
                  </div>
                )
              })}
            </ListItem>
            <Button sx={{ position: 'absolute', bottom: '0%', right: '0%' }} onClick={handleVictory} >next</Button>
          </Box>
        </Fade>
      </Modal>


    </Container>
  );
}

export default CombatPage;
