import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './PlayerPage.css';

const initialStats = {
  HP: 100,
  MP: 100,
  Strength: 10,
  Dexterity: 10,
  Intelligence: 10,
  Luck: 10,
  Defense: 10,
  Speed: 10,
  Concentration: 10,
  Reaction: 10,
  HP_Regeneration: 0,
  MP_Regeneration: 0,
};

function PlayerPage() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [stats, setStats] = useState(initialStats);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      if (stat === "HP" || stat === "MP") {
        setStats({ ...stats, [stat]: stats[stat] + 10 });
        setRemainingPoints(remainingPoints - 1);
      }
      else if (stat === "HP_Regeneration" || stat === "MP_Regeneration"){
        if (remainingPoints >= 10 ) {
          setStats({ ...stats, [stat]: stats[stat] + 1 });
          setRemainingPoints(remainingPoints - 10);
        }
      }
      else {
        setStats({ ...stats, [stat]: stats[stat] + 1 });
        setRemainingPoints(remainingPoints - 1);
      }
      
    } else if (!increment && stats[stat] > 0) {
      if (stat === "HP" || stat === "MP") {
        setStats({ ...stats, [stat]: stats[stat] - 10 });
        setRemainingPoints(remainingPoints + 1);
      }
      else if ((stat === "HP_Regeneration" || stat === "MP_Regeneration")){
        setStats({ ...stats, [stat]: stats[stat] - 1 });
        setRemainingPoints(remainingPoints + 10);
      }
      else {
        setStats({ ...stats, [stat]: stats[stat] - 1 });
        setRemainingPoints(remainingPoints + 1);
      }
    }
  };
  
  const handleSubmit = () => {
    const data = {
      story: location.state.story,
      player: {
        name: name,
        description: description,
        status: {
          status: stats,
          max_status: {...stats},
          added_status: Object.keys(stats).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {})
        }
      }
    }

    fetch('http://localhost:8000/first', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        navigate("/main", { state: data })
      });
  }

  return (
    <div className="player-status-container">
      <div className="player-info">
        <input type="text" placeholder="Player Name" className="player-name" onChange={(e) => setName(e.target.value)}/>
        <textarea placeholder="Player Description" className="player-description" onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div className="stat-allocation">
        <h2>Allocate Stats</h2>
        <p>Remaining Points: {remainingPoints}</p>
        <div className="stat-list">
          {Object.keys(stats).map((stat) => (
            <div key={stat} className="stat-item">
              <span>{stat}</span>
              <div className="stat-controls">
                <button onClick={() => handleStatChange(stat, false)}>-</button>
                <span>{stats[stat]}</span>
                <button onClick={() => handleStatChange(stat, true)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default PlayerPage;
