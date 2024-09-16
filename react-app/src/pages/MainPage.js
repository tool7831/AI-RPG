import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StatusBox from '../components/statusBox.js';
import StoryBox from '../components/storyBox.js';
import { Container, Box } from '@mui/material';
import { Player } from '../scripts/player.ts';

function MainPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [player, setPlayer] = useState();
 
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


  const handleChoice = (choiceId) => {
    console.log(choiceId)
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
  };


  return (
    <div className="App">
      <Container sx={{border: 'solid'}}>
        <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center', width: '100%'}}>
          <StoryBox story={story} choices={choices} handleChoice={handleChoice} />
          {player && ( <StatusBox actor={player} isPlayer={true}/>)}
        </Box>
      </Container>
    </div>

  );
}

export default MainPage;
