import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBox from '../components/statusBox.js';
import './CombatPage.css';

function CombatPage() {
  const [player, setPlayer] = useState();
  const [enemy, setEnemy] = useState();
  const [inventoryVisible, setInventoryVisible] = useState(false);
  
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
          setEnemy(data.combat);
          setPlayer(data.player);
        }
        else {
          console.log('go story page');
        }
      });
  },[]);


  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
  };

  function formatStat(value) {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  return (
    <div className="App">
      <div className="container">
        {player && (<StatusBox status={player.status} handleInventoryToggle={handleInventoryToggle}/>)}
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

export default CombatPage;
