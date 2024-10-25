import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, List, Grid, ListItemButton, Tabs, Tab, Fade, Modal, Backdrop, ListItem, Paper, LinearProgress, ListItemText } from '@mui/material';
import { AttackBox, DefendBox, SmiteBox } from '../components/skillBox.js';
import { SkillIcons } from '../components/icons.js';
import { fetchWithAuth } from '../components/api.js';
import StatusBox from '../components/statusBox.js';
import StatusEffectBar from '../components/statusEffectBar.js';
import MenuButton from '../components/menuButton.js'
import ItemBox from '../components/itemBox.js';
import Enemy from '../scripts/enemy.ts'
import Player from '../scripts/player.ts';

import './animation/animation.css'

import DamageNumber from './animation/attackEffect.js';
import SkillTab from '../components/skillTab.js';

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
function CombatPage({ data, handleFetch, streamDone }) {
  const navigate = useNavigate();
  const [player, setPlayer] = useState();
  const [enemy, setEnemy] = useState();
  const [rewards, setRewards] = useState(null);
  const [rewardSkill, setRewardSkill] = useState(null);
  const [enemyAction, setEnemyAction] = useState(null);
  const [playerAction, setPlayerAction] = useState(null);
  const [enemyWin, setEnemyWin] = useState(false);
  const [playerWin, setPlayerWin] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedAction, setSeletedAction] = useState(0);
  const [victoryModal, setVictoryModal] = useState(false);
  const [defeatModal, setDefeatModal] = useState(false);
  const [rewardSkillModal, setRewardSkillModal] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [stage, setStage] = useState();
  const [render, setRender] = useState(0);
  const [logs, setLogs] = useState([]);
  const logBoxRef = useRef(null);

  const addLog = (message) => {
    const newLogs = Array.isArray(message) ? message : [message];
    setLogs((prevLogs) => [...prevLogs, ...newLogs]);
  }

  const [enemyDamage, setEnemyDamage] = useState([]);
  const [playerDamage, setPlayerDamage] = useState([]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const getRandomPosition = (min, max) => Math.random() * (max - min) + min;
  const showDamage = async (actor, damageArray, delay = 300) => {
    for (let i = 0; i < damageArray.length; i++) {
      const damageAmount = damageArray[i];
      const newDamage = {
        id: Date.now() + i,  // 고유한 ID 생성
        amount: damageAmount,    // 데미지 값 저장
        startX: getRandomPosition(-50, 50), // 적 주변의 랜덤 X 시작 좌표
        startY: getRandomPosition(-50, 50), // 적 주변의 랜덤 Y 시작 좌표
        endX: getRandomPosition(-50, 50),   // 랜덤하게 움직일 X 좌표
        endY: getRandomPosition(-50, 50),    // 랜덤하게 움직일 Y 좌표
      };
      if (actor === 'Player') {
        setPlayerDamage((prevDamageList) => [...prevDamageList, newDamage]);
        // 애니메이션이 끝난 후 데미지 숫자 제거
        setTimeout(() => {
          setPlayerDamage((prev) => prev.filter(d => d.id !== newDamage.id));
        }, 1000); // 1초 후 제거
      }
      else {
        setEnemyDamage((prevDamageList) => [...prevDamageList, newDamage]);

        // 애니메이션이 끝난 후 데미지 숫자 제거
        setTimeout(() => {
          setEnemyDamage((prev) => prev.filter(d => d.id !== newDamage.id));
        }, 1000); // 1초 후 제거
      }
      // 각 데미지 간의 대기 시간 (delay만큼 기다림)
      await wait(delay);  // 동기적 대기
    }
  };

  const takeDamage = async (actor, damageArray, delay = 300) => {
    addLog(damageArray.map((damage) => (actor + `: -${damage}`)));
    await showDamage(actor, damageArray, delay);
  }

  useEffect(() => {
    console.log(data)
    if (Object.keys(data).includes('content') && typeof data.content === 'object' && data.content !== null) {
      setImageURL(data?.content?.image_url);
      setStage(data.stage);
      if (Object.keys(data?.content).includes('combat') && typeof data.content.combat === 'object' && data.content.combat !== null) {
        if (Object.keys(data?.content?.combat).includes('combat') && typeof data.content.combat.combat === 'object' && data.content.combat.combat !== null) {
          if (!streamDone) {
            setEnemy(data?.content?.combat?.combat);
          }
          else {
            setEnemy(Enemy.fromJSON(data?.content?.combat?.combat));
            setPlayer(Player.fromJSON(data.player));
          }
        }
      }
      if (Object.keys(data?.content).includes('rewards') && typeof data.content.rewards === 'object' && data.content.rewards !== null) {
        if (Object.keys(data?.content?.rewards).includes('rewards') && typeof data.content.rewards.rewards === 'object' && data.content.rewards.rewards !== null) {
          setRewards(data?.content?.rewards?.rewards);

        }
      }
    }
  }, [data, streamDone]);

  useEffect(() => {
    // 로그가 추가될 때마다 스크롤을 맨 아래로 이동
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

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

  const handleVictory = async () => {
    setVictoryModal(!victoryModal);
    rewards.forEach(reward => {
      player.getRewards(reward);
    });
    if (rewardSkill) {
      if (!player.addSkill(rewardSkill.actionType, rewardSkill.skill)) {
        setRewardSkillModal(true);
      }
      else {
        submitData();
      }
    }
    else {
      submitData();
    }
  }
  const handleSkillAdd = () => {
    if (!player.addSkill(rewardSkill.actionType, rewardSkill.skill)) {
      alert('You should delete skill');
    }
    else {
      setRewardSkillModal(false);
      submitData();
    }
  }
  const handleSkillSkip = () => {
    setRewardSkillModal(false);
    submitData();
  }

  const submitData = () => {
    const data = {
      player: player.toDict(),
      stage: stage,
      story: { text: 'Player win ' + enemy.name }
    }
    handleFetch(process.env.REACT_APP_FAST_API_URL + '/story_gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  const handleDefeat = () => {
    try {
      const response = fetchWithAuth(process.env.REACT_APP_FAST_API_URL + '/defeat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        console.log('defeat');
        setDefeatModal(!defeatModal);
        navigate('/home');
      }
      else {
        navigate('/home');
      }
    }
    catch (error) {
      alert(error);

    }
  }

  const battle = async (player_action) => {
    const e = enemy.doAction();
    const enemy_action = e.action;
    const enemy_skill = e.skill;
    const player_skill = player.doAction(player_action, selectedSkill);

    setEnemyAction(e);
    setPlayerAction({ action: player_action, skill: player_skill });

    console.log('Enemy:', e);
    console.log('Player:', player_action, player_skill);
    if (player_action === 0 && enemy_action === 0) {
      // 둘다 공격
      if (player.status.status.agility < enemy.status.status.agility) {
        await takeDamage('Player', player.damaged(enemy_skill));
        await wait(300);
        if (!player.isDead()) {
          await takeDamage('Enemy', enemy.damaged(player_skill));
        }
      }
      else {
        await takeDamage('Enemy', enemy.damaged(player_skill));
        await wait(300);
        if(!enemy.isDead()) {
          await takeDamage('Player', player.damaged(enemy_skill));
        }
      }
      setEnemyWin(true);
      setPlayerWin(true);
    }
    else if (player_action === 0 && enemy_action === 1) {
      // 공격 패?
      setEnemyWin(true);
      setPlayerWin(false);
      if (enemy_skill.type === 'shield') {
        enemy.status.addBuff(enemy_skill);
        addLog('Enemy: shield');
        player_skill.damage /= 2;
        await takeDamage('Enemy', enemy.damaged(player_skill));
      }
      else if (enemy_skill.type === 'parry') {
        for (let i = 0; i < player_skill.count; i++) {
          const parry_rand = rand(0, 99);
          const parry = { ...player_skill, 'count': 1 };
          if (enemy_skill.value < parry_rand) {
            addLog("Enemy: parry_success");
            await takeDamage('Player', player.damaged(parry));
          }
          else {
            addLog("Enemy: parry_fail");
            await takeDamage('Enemy', enemy.damaged(parry));
          }
        }
      }
      else if (enemy_skill.type === 'dodge') {
        for (let i = 0; i < player_skill.count; i++) {
          const dodge_rand = rand(0, 99);
          const dodge = { ...player_skill, 'count': 1 };
          if (enemy_skill.value >= dodge_rand) {
            addLog('Enemy: dodge_fail');
            await takeDamage('Enemy', enemy.damaged(dodge));
          }
          else {
            addLog('Enemy: dodge_success');
          }
        }
      }
    }
    else if (player_action === 0 && enemy_action === 2) {
      // 공격 승
      setEnemyWin(false);
      setPlayerWin(true);
      await takeDamage('Enemy', enemy.damaged(player_skill));
    }
    else if (player_action === 1 && enemy_action === 0) {
      // 방어 승?
      setEnemyWin(false);
      setPlayerWin(true);
      if (player_skill.type === 'shield') {
        addLog('Player: shield')
        player.status.addBuff(player_skill);
        enemy_skill.damage /= 2;
        await takeDamage('Player', player.damaged(enemy_skill));
      }
      else if (player_skill.type === 'parry') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const parry_rand = rand(0, 99);
          const attack = { ...enemy_skill, 'count': 1 };
          if (player_skill.value < parry_rand) {
            addLog("Player: parry_success");
            await takeDamage('Enemy', enemy.damaged(attack));
          }
          else {
            addLog("Player: parry_fail");
            await takeDamage('Player', player.damaged(attack));
          }
        }
      }
      else if (player_skill.type === 'dodge') {
        for (let i = 0; i < enemy_skill.count; i++) {
          const dodge_rand = rand(0, 99)
          const attack = { ...enemy_skill, 'count': 1 }
          if (player_skill.value >= dodge_rand) {
            addLog('Player: dodge_fail');
            await takeDamage('Player', player.damaged(attack));
          }
          else {
            addLog('Player: dodge_success');
          }
        }
      }
    }
    else if (player_action === 1 && enemy_action === 1) {
      // 무시
      setEnemyWin(true)
      setPlayerWin(true)
      if (player_skill.type === 'shield') {
        addLog('Player: shield')
        player.status.addBuff(player_skill)
      }
      if (enemy_skill.type === 'shield') {
        addLog('Enemy: shield')
        enemy.status.addBuff(enemy_skill)
      }
    }
    else if (player_action === 1 && enemy_action === 2) {
      // 방어 패
      setEnemyWin(true)
      setPlayerWin(false)
      if (enemy_skill.type === 'hp_scaling') {
        await takeDamage('Player', [player.status.damaged(Math.floor(player.status.origin_status.hp * enemy_skill.value / 100))])
      }
      else if (enemy_skill.type === 'damage') {
        await takeDamage('Player', [player.status.damaged(enemy_skill.value)])
      }
      else if (enemy_skill.type === 'stun') {
        player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration })
      }
    }
    else if (player_action === 2 && enemy_action === 0) {
      // 강타 패
      setEnemyWin(true)
      setPlayerWin(false)
      await takeDamage('Player', player.damaged(enemy_skill))
    }
    else if (player_action === 2 && enemy_action === 1) {
      // 강타 숭
      setEnemyWin(false)
      setPlayerWin(true)
      if (player_skill.type === 'hp_scaling') {
        await takeDamage('Enemy', [enemy.status.damaged(enemy.status.origin_status.hp * player_skill.value / 100)]);
      }
      else if (player_skill.type === 'damage') {
        await takeDamage('Enemy', [enemy.status.damaged(player_skill.value)]);
      }
      else if (player_skill.type === 'stun') {
        enemy.status.addStatusEffect({ name: player_skill.name, type: 'Stun', value: 0, duration: player_skill.duration });
      }
    }
    else if (player_action === 2 && enemy_action === 2) {
      // 스탯 강한 쪽 승
      if (player_skill.value > enemy_skill.value) {
        setEnemyWin(false)
        setPlayerWin(true)
        if (player_skill.type === 'hp_scaling') {
          await takeDamage('Enemy', [enemy.status.damaged(Math.floor(enemy.status.origin_status.hp * player_skill.value / 100))]);
        }
        else if (player_skill.type === 'damage') {
          await takeDamage('Enemy', [enemy.status.damaged(player_skill.value)]);
        }
        else if (player_skill.type === 'stun') {
          enemy.status.addStatusEffect({ name: player_skill.name, type: 'Stun', value: 0, duration: player_skill.duration });
        }
      }
      else if (player_skill.value < enemy_skill.value) {
        setEnemyWin(true)
        setPlayerWin(false)
        if (enemy_skill.type === 'hp_scaling') {
          await takeDamage('Player', [player.status.damaged(Math.floor(player.status.origin_status.hp * enemy_skill.value / 100))]);
        }
        else if (enemy_skill.type === 'damage') {
          await takeDamage('Player', [player.status.damaged(enemy_skill.value)]);
        }
        else if (enemy_skill.type === 'stun') {
          player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration });
        }
      }
      else {
        console.log('draw');
      }
    }
    else if (player_action === 4) {
      setEnemyWin(true)
      setPlayerWin(false)
      if (enemy_action === 0) {
        await takeDamage('Player', player.damaged(enemy_skill))
      }
      else if (enemy_action === 1) {
        if (enemy_skill.type === 'shield') {
          addLog('Enemy: Shield')
          enemy.status.addBuff(enemy_skill)
        }
      }
      else if (enemy_action === 2) {
        if (enemy_skill.type === 'hp_scaling') {
          await takeDamage('Player', [player.status.damaged(Math.floor(player.status.origin_status.HP * enemy_skill.value / 100))])
        }
        else if (enemy_skill.type === 'damage') {
          await takeDamage('Player', [player.status.damaged(enemy_skill.value)])
        }
        else if (enemy_skill.type === 'stun') {
          player.status.addStatusEffect({ name: enemy_skill.name, type: 'Stun', value: 0, duration: enemy_skill.duration })
        }
      }
    }
    else if (enemy_action === 4) {
      setEnemyWin(false)
      setPlayerWin(true)
      if (player_action === 0) {
        await takeDamage('Enemy', enemy.damaged(player_skill))
      }
      else if (player_action === 1) {
        if (player_skill.type === 'shield') {
          addLog('Player: Shield')
          player.status.addBuff(player_skill)
        }
      }
      else if (player_action === 2) {
        if (player_skill.type === 'hp_scaling') {
          await takeDamage('Enemy', [enemy.status.damaged(Math.floor(enemy.status.origin_status.HP * player_skill.value / 100))])
        }
        else if (enemy_skill.type === 'damage') {
          await takeDamage('Enemy', [enemy.status.damaged(player_skill.value)])
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
      player.endCombat();
      getRewardSkill();
      setVictoryModal(true);
    }
    else if (player.isDead()) {
      setDefeatModal(true)
    }
  };

  const getRewardSkill = () => {
    const actionType = rand(0, 2);
    if (actionType === 0) {
      const skillIdx = rand(0, enemy.attacks.length - 1);
      setRewardSkill({ actionType: 0, skill: enemy.attacks[skillIdx] });
    }
    else if (actionType === 1) {
      const skillIdx = rand(0, enemy.defends.length - 1);
      setRewardSkill({ actionType: 1, skill: enemy.defends[skillIdx] });
    }
    else if (actionType === 2) {
      const skillIdx = rand(0, enemy.smites.length - 1);
      setRewardSkill({ actionType: 2, skill: enemy.smites[skillIdx] });
    }
  }

  const renderSkills = (skills) => (
    <Box sx={{ padding: '10px' }}>
      <List>
        {selectedSkill === null && skills.map((skill, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleSkillSelect(index)}
            disabled={skill.curCooldown !== 0 || !player.getActionAvailable()}
            sx={{
              borderBottom: '1px solid'
            }}
          >
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
    <Container
      sx={{
        border: '2px solid',
        minWidth: '1000px',
        backgroundColor: 'whitesmoke',
        borderRadius: '10px'
      }}
    >
      {/* 적 */}
      {enemy && (
        <Box sx={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-evenly',
          padding: '10px'
        }}
        >
          <Grid container>
            <Grid item xs={6}
              sx={{
                display: 'flex', flexGrow: '1',
                flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  width: '300px',
                  height: '200px',
                  overflowY: 'auto',
                  border: '1px solid #ddd'
                }}>
                {/* <img src={imageURL} alt='Not found' width={300} height={300} style={{ border: '1px solid' }} /> */}
                <Typography variant='h5' sx={{ textAlign: 'center' }}>{enemy?.name}</Typography>
                <Typography variant='body2'>{enemy?.description}</Typography>
                {enemyDamage.map((d) => (
                  <DamageNumber key={d.id} damage={d} />
                ))}
              </Paper>
              <Box
                ref={logBoxRef}
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid',
                  width: '280px',
                  height: '100px',
                  marginTop: '10px',
                  overflowY: 'auto',
                  padding: '10px'
                }}>
                <Typography>Log</Typography>
                {logs.map((log) => <Typography variant='body2'>{log}</Typography>)}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <StatusBox
                  actor={enemy}
                  sx={{ width: '90%' }}
                  streamDone={streamDone}
                  elevation={0}
                />
                <StatusEffectBar actor={enemy} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      {!streamDone && <LinearProgress />}
      {/* 행동 */}
      {streamDone &&
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100px',
          }}
        >
          <Grid container>
            <Grid item xs={6}
              sx={{
                display: 'flex',
                flexGrow: '1',
                justifyContent: 'center',
                alignItems: 'center'
              }
              }>
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
            <Grid item xs={6}
              sx={{
                display: 'flex',
                borderTop: '2px solid',
                borderLeft: '2px solid',
                borderRight: '2px solid',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                flexGrow: '1',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
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
        </Box>}

      {/* 플레이어 */}
      {streamDone &&
        <Box
          sx={{
            backgroundColor: 'whitesmoke'
          }}
        >
          <Grid container>
            {/* 스킬 */}
            <Grid item xs={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '2px solid',
                borderTop: '2px solid',
                borderTopLeftRadius: '10px',
              }
              }>
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
            <Grid item xs={6} sx={{ position: 'relative', borderRight: '2px solid' }}>
              {player && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '95%'
                  }}
                >
                  <StatusEffectBar actor={player} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', height: '80px' }}>
                    <MenuButton actor={player} onClose={() => setRender(render + 1)} />
                  </Box>
                </Box>
              )}
              {player && (<StatusBox actor={player} isPlayer={true} sx={{ width: '90%' }} />)}
              {playerDamage.map((d) => (
                <DamageNumber key={d.id} damage={d} />
              ))}
            </Grid>
          </Grid>
        </Box>}


      {/* 승리 */}
      <Modal
        open={victoryModal}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">Victory</Typography>
          <List sx={{ display: 'flex', flexDirection: 'column'}}>
            {rewards !== null && rewards.map(reward => {
              if ('exp' in reward)
                return (
                  <ListItem sx={{borderBottom: '1px solid' }}>
                    <ListItemText primary={`Exp: ${reward.exp}`} />
                  </ListItem>)
              else if ('gold' in reward)
                return (
                  <ListItem  sx={{borderBottom: '1px solid' }}>
                    <ListItemText primary={`Gold: ${reward.gold}`} />
                  </ListItem>)
              else if ('items' in reward)
                return reward.items.map((item) => {
                  return (
                    <ListItem sx={{borderBottom: '1px solid' }}>
                      <ItemBox item={item} sx={{}} />
                    </ListItem>)
                })
              return null;
            })}
            {rewardSkill && (
              <ListItem sx={{borderBottom: '1px solid' }}>
                {rewardSkill.actionType === 0 && <AttackBox skill={rewardSkill.skill} status={player.status.status} />}
                {rewardSkill.actionType === 1 && <DefendBox skill={rewardSkill.skill} status={player.status.status} />}
                {rewardSkill.actionType === 2 && <SmiteBox skill={rewardSkill.skill} status={player.status.status} />}
              </ListItem>
            )}
          </List>

          <Button sx={{ position: 'absolute', bottom: '0%', right: '0%' }} onClick={handleVictory} >next</Button>
        </Box>
      </Modal>

      {/* 패배 */}
      <Modal
        open={defeatModal}
        disableEnforceFocus
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">Defeat</Typography>
          <Button sx={{ position: 'absolute', bottom: '0%', right: '0%' }} onClick={handleDefeat} >Home</Button>
        </Box>
      </Modal>

      {/* 스킬 교환 창 */}
      <Modal
        open={rewardSkillModal}
      >
        <Box sx={{...style, width: '70%'}}>
          {rewardSkill && (
            <React.Fragment>
              <Typography>The number of skills has reached its limit.</Typography>
              {rewardSkill.actionType === 0 && <Typography>You should delete attack skill</Typography>}
              {rewardSkill.actionType === 1 && <Typography>You should delete defense skill</Typography>}
              {rewardSkill.actionType === 2 && <Typography>You should delete smite skill</Typography>}
              <SkillTab actor={player} />
              {rewardSkill.actionType === 0 && <AttackBox skill={rewardSkill.skill} status={player.status.status} sx={{marginTop:'10px', marginBottom:'10px'}}/>}
              {rewardSkill.actionType === 1 && <DefendBox skill={rewardSkill.skill} status={player.status.status} sx={{marginTop:'10px', marginBottom:'10px'}}/>}
              {rewardSkill.actionType === 2 && <SmiteBox skill={rewardSkill.skill} status={player.status.status} sx={{marginTop:'10px', marginBottom:'10px'}}/>}
              <Button variant='contained' onClick={handleSkillAdd}>Add Skill</Button>
              <Button variant='contained' onClick={handleSkillSkip}>Skip</Button>
            </React.Fragment>)}

        </Box>
      </Modal>
    </Container>
  );
}

export default CombatPage;
