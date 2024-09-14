import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBox from '../components/statusBox.js';
import { Container, Box, Button, Typography, List, Grid, ListItemButton, Tabs, Tab, Fade, Modal, Paper, Backdrop } from '@mui/material';
import './CombatPage.css';
import Enemy from '../scripts/enemy.ts'
import { Player } from '../scripts/player.ts';
import { AttackBox, DefendBox } from '../components/skillBox.js';

function rand(min, max ) {
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
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedAction, setSeletedAction] = useState(0);
  const [reRender,setReRender] = useState(0);
  const [victoryModal,setVictoryModal] = useState(false);
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
        } else {
          console.log('go story page');
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
    setVictoryModal(!victoryModal)
    const data = {
      player: player.toDict(),
      story:{text:'win'}
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
          navigate('/main')
        }
        else {
          console.log(data.success);
        }
      });
  }

  const battle = (player_action) => {
    const e = enemy.doAction();
    const enemy_action = e.action
    const enemy_skill = e.skill
    const player_skill = player.doAction(player_action, selectedSkill)
    console.log(e)
    console.log(player_skill)
    if (player_action === 0 && enemy_action === 0) {
      // 둘다 공격
      player.damaged(enemy_skill)
      enemy.damaged(player_skill)
    }
    else if (player_action === 0 && enemy_action === 1) {
      // 공격 패?
      if (enemy_skill.type === 'shield') {
        enemy.status.addBuff(enemy_skill)
        enemy.damaged(player_skill)
      }
      else if (enemy_skill.type === 'parry') {
        for (let i = 0; i < player_skill.count; i++) {
          const parry_rand = rand(0,99)
          const parry = {...player_skill, 'count': 1}
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
      else if (enemy_skill === 'dodge') {
        for (let i = 0; i < player_skill.count; i++) {
          const dodge_rand = rand(0,99)
          const dodge = {...player_skill, 'count': 1}
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
      enemy.damaged(player_skill)
    }
    else if (player_action === 1 && enemy_action === 0) {
      // 방어 승?
      if (player_skill.type === 'shield') {
        player.status.addBuff(player_skill)
        player.damaged(enemy_skill)
      }
      else if (player_skill.type === 'parry') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const parry_rand = rand(0,99)
          const attack = {...enemy_skill, 'count': 1}
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
      else if (player_skill === 'dodge') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const dodge_rand = rand(0,99)
          const attack = {...enemy_skill, 'count': 1}
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
      if (player_skill.type === 'shield') {
        player.status.addBuff(player_skill)
      }
      if (enemy_skill.type === 'shield') {
        enemy.status.addBuff(enemy_skill)
      }
    }
    else if (player_action === 1 && enemy_action === 2) {
      // 방어 패
      if (enemy_skill.type === 'hp_scailing'){
        player.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))
      }
      else if (enemy_skill.type === 'damage'){
        player.damaged(enemy_skill.value)
      }
      else if (enemy_skill.type === 'stun'){
        player.status.addStatusEffect({name:enemy_skill.name, type: 'Stun', value:0, duration: enemy_skill.duration})
      }
    }
    else if (player_action === 2 && enemy_action === 0) {
      // 강타 패
      player.damaged(enemy_skill)
    }
    else if (player_action === 2 && enemy_action === 1) {
      // 강타 숭
      if (player_skill.type === 'hp_scailing'){
        enemy.damaged(Math.floor(enemy.status.origin_status.HP * player_skill.value / 100))
      }
      else if (enemy_skill.type === 'damage'){
        enemy.damaged(player_skill.value)
      }
      else if (player_skill.type === 'stun'){
        enemy.status.addStatusEffect({name:player_skill.name, type: 'Stun', value:0, duration: player_skill.duration})
      }
    }
    else if (player_action === 2 && enemy_action === 2) {
      // 스탯 강한 쪽 승
      if (player_skill.value > enemy_skill.value) {
        if (player_skill.type === 'hp_scailing'){
          enemy.damaged(Math.floor(enemy.status.origin_status.HP * player_skill.value / 100))
        }
        else if (enemy_skill.type === 'damage'){
          enemy.damaged(player_skill.value)
        }
        else if (player_skill.type === 'stun'){
          enemy.status.addStatusEffect({name:player_skill.name, type: 'Stun', value:0, duration: player_skill.duration})
        }
      }
      else if (player_skill < enemy_skill){
        if (enemy_skill.type === 'hp_scailing'){
          player.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))
        }
        else if (enemy_skill.type === 'damage'){
          player.damaged(enemy_skill.value)
        }
        else if (enemy_skill.type === 'stun'){
          player.status.addStatusEffect({name:enemy_skill.name, type: 'Stun', value:0, duration: enemy_skill.duration})
        }
      }
      else {
        console('draw')
      }
    }
    else if (player_action === 4) {
      if (enemy_action === 0)
        player.damaged(enemy_skill)
      else if (enemy_action === 1)
        if (enemy_skill.type === 'shield')
          enemy.status.addBuff(enemy_skill)
    }
    else if (enemy_action === 4) {
      if (player_action === 1)
        enemy.damaged(player_skill)
      else if (player_action === 2)
        if (player_skill.type === 'shield')
          player.status.addBuff(player_skill)
    }

    setReRender(reRender+1)
    console.log('Player:',player.status.curStatusEffects)
    console.log('Enemy:',enemy.status.curStatusEffects)
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
    <Box sx={{border:'solid', padding:'10px'}}>
      <List>
        {selectedSkill === null && skills.map((skill, index) => (
          <ListItemButton key={index} onClick={() => handleSkillSelect(index)} disabled={skill.curCooldown !== 0} >
            <Typography>{skill.name}</Typography>
            <Typography variant="body2" color="textSecondary"> ({skill.curCooldown})</Typography>
          </ListItemButton>
        ))}
      </List>
      {selectedSkill !== null && selectedAction === 0 && (
        <Box sx={{ mt: 2 }}>
          <AttackBox skill={player.attacks[selectedSkill]} />
          <Button onClick={handleConfirmAttack} sx={{ mt: 2 }}>Confirm</Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>Cancel</Button>
        </Box>
      )}
      {selectedSkill !== null && selectedAction === 1 && (
        <Box sx={{ mt: 2 }}>
          <DefendBox skill={player.defends[selectedSkill]} />
          <Button onClick={handleConfirmAttack} sx={{ mt: 2 }}>Confirm</Button>
          <Button onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>Cancel</Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Container>
      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', border: 'solid', marginBottom:'100px'}}> 
        {enemy && (<StatusBox status={enemy.status.toDict()}/>)}
        <img src='monster_sample.png' width={400} height={400}/>
      </Box>

      <Box sx={{ border: 'solid'}}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
            <Box>
              <Button onClick={() => {battle(4); setSelectedSkill(null);}}>Skip</Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            {player && (<StatusBox status={player.status} isPlayer={true} />)}
          </Grid>
        </Grid>
      </Box>


      <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={victoryModal} closeAfterTransition slots={{backdrop:Backdrop}} slotProps={{backdrop: {timeout: 500,},}}>
        <Fade in={victoryModal}>
          <Box sx={style}>
            <Button contained sx={{position:'absolute', bottom:'0%', right:'0%'}} onClick={handleVictory} >next</Button>
            <Typography id="transition-modal-title" variant="h6" component="h2" border={'solid'} >Victory</Typography>
          </Box>  
        </Fade>
      </Modal>


    </Container>
  );
}

export default CombatPage;
