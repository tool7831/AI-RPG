import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBox from '../components/statusBox.js';
import { Container, Box, Button, Typography, Modal, List, ListItem, ButtonGroup, Grid, ListItemButton, Tabs, Tab } from '@mui/material';
import './CombatPage.css';
import Enemy from '../scripts/enemy.ts'
import { Player } from '../scripts/player.ts';
import { AttackBox, DefendBox } from '../components/skillBox.js';
function CombatPage() {
  const [player, setPlayer] = useState();
  const [enemy, setEnemy] = useState();
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [showAttackOptions, setShowAttackOptions] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedAction, setSeletedAction] = useState(0);
  const [confirmAttack, setConfirmAttack] = useState(false);

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
      battle(selectedAction, player.doAction(selectedAction, selectedSkill));
      setShowAttackOptions(false);
      setConfirmAttack(false);
      setSelectedSkill(null);
    }
  };
  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
  };
  const handleCancel = () => {
    setSelectedSkill(null);
  };

  const battle = (player_action, player_skill) => {
    const e = enemy.doAction();
    const enemy_action = e.action
    const enemy_skill = e.skill
    console.log(e)
    if (player_action === 0 && enemy_action === 0) {
      // 둘다 공격
    }
    else if (player_action === 0 && enemy_action === 1) {
      // 공격 패
    }
    else if (player_action === 0 && enemy_action === 2) {
      // 공격 승
    }
    else if (player_action === 1 && enemy_action === 0) {
      // 방어 승
    }
    else if (player_action === 1 && enemy_action === 1) {
      // 무시
    }
    else if (player_action === 1 && enemy_action === 2) {
      // 방어 패
    }
    else if (player_action === 2 && enemy_action === 0) {
      // 강타 패
    }
    else if (player_action === 2 && enemy_action === 1) {
      // 강타 숭
    }
    else if (player_action === 2 && enemy_action === 2) {
      // 스탯 강한 쪽 승
    }

    // Battle logic here
  };

  const renderSkills = (skills) => (
    <Box sx={{border:'solid', padding:'10px'}}>
      <List>
        {selectedSkill === null && skills.map((skill, index) => (
          <ListItemButton key={index} onClick={() => handleSkillSelect(index)}>
            <Typography>{skill.name}</Typography>
            <Typography variant="body2" color="textSecondary">description</Typography>
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
        {enemy && (<StatusBox status={enemy.status}/>)}
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
          </Grid>
          <Grid item xs={6}>
            {player && (<StatusBox status={player.status} handleInventoryToggle={handleInventoryToggle} isPlayer={true}/>)}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CombatPage;
