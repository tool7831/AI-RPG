import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StatusBox from '../components/statusBox.js';
import StoryBox from '../components/storyBox.js';
import { Container, Box, Modal } from '@mui/material';
import { Player } from '../scripts/player.ts';
import Dice from '../components/rollDice.js';
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
function MainPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [player, setPlayer] = useState();
  const [diceVisible, setDiceVisible] = useState(false);
  const [choiceId, setChoiceId] = useState(null);
  const [prob, setProb] = useState(10);
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
          console.log("go combat page");
          navigate('/combat')
        }
        else {
          console.log(data);
          setStory(data.story)
          setChoices(data.choices)
          setPlayer(Player.fromJSON(data.player))
        }
      });
  }, []);

  const handleClose = (diceResult) => {
    setDiceVisible(false)
    nextStory(diceResult);
  }

  const nextStory = (diceResult) => {
    if (diceResult >= prob)
      choices[choiceId].text = 'Success this choice. ' + choices[choiceId].text
    else 
      choices[choiceId].text = 'Fail this choice. ' + choices[choiceId].text
    const data = {
      story: choices[choiceId],
      player: player.toDict()
    };
    console.log(data)
    fetch('http://localhost:8000/story_gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')) {
          navigate('/combat')
        }
        else {
          console.log(data);
          setPlayer(Player.fromJSON(data.player))
        }
      });
  }

  const handleChoice = (choiceId) => {
    setChoiceId(choiceId);
    if (Object.keys(choices[choiceId].status).length !== 0) {
      setProb(calculateProb(choiceId));
      setDiceVisible(true);
    }
    else {
      nextStory(20);
    }

  };

  const calculateProb = (choiceId) => {
    console.log(player.status.status);
    console.log(choices[choiceId].status);
    let diff = 0;
    Object.keys(choices[choiceId].status).forEach((key)=> {
      diff += player.status.status[key] - choices[choiceId].status[key]
    })
    return Math.ceil(20 / (1+ Math.exp(diff/10)))
  }

  return (
    <div className="App">
      <Container sx={{border: 'solid'}}>
        <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <div style={{margin:'10px'}}><StoryBox story={story} choices={choices} handleChoice={handleChoice}/></div>
          {player && ( <StatusBox actor={player} isPlayer={true}/>)}
        </Box>
      </Container>

      <Modal open={diceVisible} >
        <Box sx={style}>
          <Dice handleClose={handleClose} prob={prob} />
        </Box>
      </Modal>
    </div>

  );
}

export default MainPage;
