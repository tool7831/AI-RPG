import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Player } from '../scripts/player.ts'
import './MainPage.css';
import StatusBox  from '../components/statusBox.js';
import StoryBox from '../components/storyBox.js';


function MainPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [player, setPlayer] = useState();
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    fetch('http://localhost:8000/load_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')){
          console.log("go combat page");
        }
        else {
          console.log(data);
          setStory(data.story)
          setChoices(data.choices)
          setPlayer(data.player)
        }
      });
  }, []);


  const handleChoice = (choiceId) => {
    console.log(choiceId)
    const data = {
      story: choices[choiceId],
      player: player
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
        if (Object.keys(data).includes('combat')){
          console.log("go combat page");
        }
        else {
          console.log(data);
          setPlayer(data.player)  
        }
      });
  };

  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
  };

  function formatStat(value) {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  return (
    <div className="App">
      <StoryBox story={story} choices={choices} handleChoice={handleChoice} />
      <div className="container">
        {player && (
          <div className="status">
            <div className="status-box">
              <p>Status</p>
              <p>Name: {player.name}</p>
              <p>Description: {player.description}</p>
              {Object.keys(player.status.status).filter(key => key !== 'HP' && key !== 'MP').map((key) => (
                <p key={key}>{key}: {player.status.status[key]} ({formatStat(player.status.added_status[key])}) / {player.status.max_status[key]}</p>
              ))}
            </div>
            <div className="stats">
              {/* <p>LV: {status.lv}</p>
            <p>EXP: <progress value={status.exp} max="100"></progress></p> */}
              <p>HP: <progress value={player.status.status.HP} max={player.status.max_status.HP}></progress></p>
              <p>MP: <progress value={player.status.status.MP} max={player.status.max_status.MP}></progress></p>
            </div>
            <div className="inventory-button">
              <button onClick={handleInventoryToggle}>Inventory</button>
            </div>
          </div>)}
      </div>
      {inventoryVisible && (
        <div id="inventory" className="inventory">
          <button className="close-btn" onClick={handleInventoryToggle}>X</button>
          <p>Inventory</p>
          <div className="equipment">
            <button>helmet</button>
            <button>armor</button>
            <button>pants</button>
            <button>shoes</button>
            <button>gloves</button>
            <button>right hand</button>
            <button>left hand</button>
            <button>ring1</button>
            <button>ring2</button>
            <button>earring1</button>
            <button>earring2</button>
            <button>necklace</button>
          </div>
          <div className="items">
            {Array.from({ length: 20 }).map((_, i) => (
              <button key={i} className="item"></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
