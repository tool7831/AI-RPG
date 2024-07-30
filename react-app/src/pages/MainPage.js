import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [name, setName] =useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState({});
  const [max_status, setMaxStatus] = useState({});
  const [added_status, setAddedStatus] = useState({});
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    if (location.state) {
      setStory(location.state.story);
      setChoices(location.state.choices);
      setName(location.state.player.name)
      setDescription(location.state.player.description)
      setStatus(location.state.player.status.status);
      setMaxStatus(location.state.player.status.max_status);
      setAddedStatus(location.state.player.status.added_status);
    }
  }, [location.state]);

  const handleChoice = (choiceId) => {
    console.log(choiceId)
    const data = {
      story: choices[choiceId],
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
        console.log(data)
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
      <div className="container">
        <div className="story">
          <p>{story}</p>
        </div>
        <div className="choices">
          {choices && choices.map((choice, index) => (
            <button key={index} onClick={() => handleChoice(index)}>
              <p>{choice.text}</p>
              {Object.keys(choice.status).map((key) => (
                <p key={key}>{key}: {choice.status[key]}</p>
              ))}
              <p>{choice.gold}</p>
              <p>{choice.next_type}</p>
            </button>
          ))}
        </div>
        <div className="status">
          <div className="status-box">
            <p>Status</p>
            <p>Name: {name}</p>
            <p>Description: {description}</p>
            {Object.keys(status).filter(key => key !== 'HP' && key !== 'MP').map((key) => (
              <p key={key}>{key}: {status[key]} ({formatStat(added_status[key])}) / {max_status[key]}</p>
            ))}
          </div>
          <div className="stats">
            {/* <p>LV: {status.lv}</p>
            <p>EXP: <progress value={status.exp} max="100"></progress></p> */}
            <p>HP: <progress value={status.HP} max={max_status.HP}></progress></p>
            <p>MP: <progress value={status.MP} max={max_status.MP}></progress></p>
          </div>
          <div className="inventory-button">
            <button onClick={handleInventoryToggle}>Inventory</button>
          </div>
        </div>
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
