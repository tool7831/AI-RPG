import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Modal, Button, Typography } from '@mui/material';

import Player from '../scripts/player.ts';
import MenuButton from '../components/menuButton.js'
import StatusBox from '../components/statusBox.js';
import StoryBox from '../components/storyBox.js';
import Dice from '../components/rollDice.js';

import { fetchWithAuth, loadData } from '../components/api.js';
import RewardBox from '../components/rewardBox.js';
import PenaltyBox from '../components/penaltyBox.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height:300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  backgroundColor: 'white'
};
function StoryPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [player, setPlayer] = useState();
  const [render, setRender] = useState(0);
  const [diceVisible, setDiceVisible] = useState(false);
  const [choiceId, setChoiceId] = useState(null);
  const [prob, setProb] = useState(10);
  const [stage, setStage] = useState();
  const navigate = useNavigate()

  const [openLoading, setOpenLoading] = useState(false);

  const [rewardModal, setRewardModal] = useState(false);
  const [reward, setReward] = useState();
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [penalty, setPenalty] = useState();
  
  useEffect(() => {
    setOpenLoading(true)
    loadData()
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')) {
          console.log("go combat page");
          navigate('/combat')
        }
        else {
          console.log(data);
          if(Object.keys(data).includes('rewards')) {
            setReward(data.rewards);
            setRewardModal(true);
          }
          else if (Object.keys(data).includes('penalty')) {
            setPenalty(data.penalty);
            setPenaltyModal(true);
          }
          setStage(data.stage)
          setStory(data.story)
          setChoices(data.choices)
          setPlayer(Player.fromJSON(data.player))
        }
      });
    setOpenLoading(false)
  }, [navigate]);

  const handleClose = (diceResult) => {
    setDiceVisible(false)
    nextStory(diceResult, choiceId);
  }

  const nextStory = async (diceResult, choiceId) => {
    if (diceResult >= prob)
      choices[choiceId].text = 'Success this choice. ' + choices[choiceId].text
    else 
      choices[choiceId].text = 'Fail this choice. ' + choices[choiceId].text
    const data = {
      story: choices[choiceId],
      stage: stage,
      player: player.toDict()
    };
    console.log(data)

    setOpenLoading(true)
    try{
      const response = await fetchWithAuth('http://localhost:8000/story_gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json();
        if (Object.keys(data).includes('combat')) {
          navigate('/combat')
        }
        else {
          if(Object.keys(data).includes('rewards')) {
            setReward(data.rewards);
            setRewardModal(true);
          }
          else if (Object.keys(data).includes('penalty')) {
            setPenalty(data.penalty);
            setPenaltyModal(true);
          }
          console.log(data);
          setStage(data.stage)
          setStory(data.story)
          setChoices(data.choices)
          setPlayer(Player.fromJSON(data.player))
        }
      }
    }
    catch(error) {
      alert(error)
    }
    setOpenLoading(false)
  }

  const handleReward = () => {
    player.getRewards(reward);
    setRewardModal(false);
  }

  const handlePenalty = () => {
    // player.getRewards(reward);
    setPenaltyModal(false);
  }

  const handleChoice = (choiceId) => {
    setChoiceId(choiceId);
    if (Object.keys(choices[choiceId].status).length !== 0) {
      setProb(calculateProb(choiceId));
      setDiceVisible(true);
    }
    else {
      nextStory(20, choiceId);
    }

  };

  const calculateProb = (choiceId) => {
    console.log(player.status.status);
    console.log(choices[choiceId].status);
    let diff = 0;
    Object.keys(choices[choiceId].status).forEach((key)=> {
      if(choices[choiceId].status[key] !== null)
        diff += player.status.status[key] - choices[choiceId].status[key]
    })
    return Math.ceil(20 / (1+ Math.exp(diff/10)))
  }

  if (openLoading) {
    return (
      <p>Loading ...</p>
    )
  }

  return (
    <div className="App">
      <Container sx={{border: 'solid'}}>
        <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <div style={{margin:'10px', border:'1px solid'}}>
            <Typography>{stage}</Typography>
            <StoryBox story={story} choices={choices} handleChoice={handleChoice}/>
          </div>
          <div style={{border:'1px solid'}}>
            <MenuButton actor={player} onClose={()=>setRender(render+1)}/>
            {player && ( <StatusBox actor={player} isPlayer={true} sx={{minWidth:'600px'}}/>)}
          </div>
        </Box>
      </Container>

      {/* 다이스 창 */}
      <Modal open={diceVisible} >
        <Box sx={style}>
          <Dice handleClose={handleClose} prob={prob} />
        </Box>
      </Modal>
      {/* 보상 창 */}
      <Modal open={rewardModal}>
        <Box sx={style}>
          <RewardBox rewards={reward}/>
          <Button onClick={()=>handleReward(false)}>close</Button>
        </Box>
      </Modal>
      {/* 패널티 창 */}
      <Modal open={penaltyModal}>
        <Box sx={style}>
          <PenaltyBox penalty={penalty}/>
          <Button onClick={()=>handlePenalty(false)}>close</Button>
        </Box>
      </Modal>
    </div>

  );
}

export default StoryPage;
