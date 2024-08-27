import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBox from '../components/statusBox.js';
import './CombatPage.css';

import { Player } from '../scripts/player.ts';
import { Button } from '@mui/material';

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
          setPlayer(Player.fromJSON(data.player));
        }
        else {
          console.log('go story page');
        }
      });
  },[]);

  const handleAttack = (index) => {
    console.log(player.doAttack(index))
    battle(player.doAttack(index))
  }

  const handleDefend = (index) => {
    console.log(player.doDefend(index))
    battle(player.doDefend(index))
  }

  const battle = (action) => {

  }

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
      <Button onClick={() => handleAttack(1)}>attack</Button>
      <Button onClick={() => handleDefend(0)}>defend</Button>
    </div>
  );
}

export default CombatPage;
