import React, { useState, useEffect } from 'react';
import { Container, Box, Modal, Button, Typography } from '@mui/material';

import Player from '../scripts/player.ts';
import MenuButton from '../components/menuButton.js'
import StatusBox from '../components/statusBox.js';
import StoryBox from '../components/storyBox.js';
import Dice from '../components/rollDice.js';

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
function StoryPage({data, handleFetch, streamDone}) {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [player, setPlayer] = useState();
  const [render, setRender] = useState(0);
  const [diceVisible, setDiceVisible] = useState(false);
  const [choiceId, setChoiceId] = useState(null);
  const [prob, setProb] = useState(10);
  const [stage, setStage] = useState();

  const [rewardModal, setRewardModal] = useState(false);
  const [reward, setReward] = useState();
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [penalty, setPenalty] = useState();
  
  useEffect(() => {
    if (Object.keys(data).includes('content') && typeof data.content === 'object' && data.content !== null) {
      if (Object.keys(data.content).includes('rewards')) {
        setReward(data.content.rewards);
        setRewardModal(true);
      } else if (Object.keys(data.content).includes('penalty')) {
        setPenalty(data.content.penalty);
        setPenaltyModal(true);
      }
    
      setStage(data.stage);
      setStory(data.content.story);
      setChoices(data.content.choices);
      setPlayer(Player.fromJSON(data.player));
    }
    
  }, [data]);

  const handleClose = (diceResult) => {
    setDiceVisible(false)
    nextStory(diceResult, choiceId);
  }

  const nextStory = async (diceResult, choiceId) => {
    if (diceResult >= prob) {
      choices[choiceId].text = 'Success this choice. ' + choices[choiceId].text;
      choices[choiceId].next_type = choices[choiceId].next_type.success;

    }
    else {
      choices[choiceId].text = 'Fail this choice. ' + choices[choiceId].text;
      if (choices[choiceId].next_type.success === 'combat') {
        choices[choiceId].next_type = choices[choiceId].next_type.success;
      }
      else {
        choices[choiceId].next_type = choices[choiceId].next_type.failure;
      }
    }
      
    const data = {
      story: choices[choiceId],
      stage: stage,
      player: player.toDict()
    };
    console.log(data)
    
    handleFetch(process.env.REACT_APP_FAST_API_URL + '/story_gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  }

  const handleReward = () => {
    player.getRewards(reward);
    setRewardModal(false);
  }

  const handlePenalty = () => {
    player.getPenalty(penalty);
    setPenaltyModal(false);
  }

  const handleChoice = (choiceId) => {
    setChoiceId(choiceId);
    if (Object.values(choices[choiceId].status).some(value => value !== null)) {
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

  return (
    <div className="App">
      <Container sx={{ minWidth:'700px'}}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography variant='h5'>Stage {stage}</Typography>
          <StoryBox story={story} choices={choices} handleChoice={handleChoice} streamDone={streamDone}/>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            width: '70%',
            marginTop: '10px' /* Optional spacing */
          }}>
            <MenuButton actor={player} onClose={() => setRender(render + 1)} />
          </Box>
          {player && ( <StatusBox actor={player} isPlayer={true} sx={{width: "70%"}}/>)}
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
