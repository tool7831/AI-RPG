import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const [story, setStory] = useState();
  const [choices, setChoices] = useState();
  const [status, setStatus] = useState();
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const location = useLocation();
  
  setStory(location.state.story)
  setChoices(location.state.choices)
  setStatus(location.state.status)

  const handleChoice = (choiceId) => {
    const data = {
      choice_id: choiceId,
      story: story,
      status: status,
    };
    
    // fetch('http://localhost:8000/choice', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       alert('Choice made: ' + choiceId);
    //       // 필요한 경우 선택 후의 동작 추가
    //     }
    //   });
    console.log(choiceId)
  };

  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="story">
          <p>{story}</p>
        </div>
        <div className="choices">
          {choices && choices.map(choice => (
            <button key={choice.id} onClick={() => handleChoice(choice.id)}>
              <p>{choice.text}</p>
              <p>{choice.status}</p>
              <p>{choice.gold}</p>
              <p>{choice.next_type}</p>
            </button>
          ))}
        </div>
        <div className="status">
          <div className="status-box">
            <p>Status</p>
          </div>
          <div className="stats">
            <p>LV: {status.lv}</p>
            <p>EXP: <progress value={status.exp} max="100"></progress></p>
            <p>HP: <progress value={status.hp} max="100"></progress></p>
            <p>MP: <progress value={status.mp} max="100"></progress></p>
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
