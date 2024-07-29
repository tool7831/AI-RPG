import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './PlayerPage.css';

const MAX_STAT_POINTS = 100;
const initialStats = {
  HP: 0,
  MP: 0,
  Strength: 0,
  Dexterity: 0,
  Intelligence: 0,
  Luck: 0,
  Defense: 0,
  Speed: 0,
  Concentration: 0,
  Reaction: 0,
  HP_Regeneration: 0,
  MP_Regeneration: 0,
};

function PlayerPage() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [stats, setStats] = useState(initialStats);
  const [remainingPoints, setRemainingPoints] = useState(MAX_STAT_POINTS);
  const location = useLocation();
  const navigate = useNavigate();

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      setStats({ ...stats, [stat]: stats[stat] + 1 });
      setRemainingPoints(remainingPoints - 1);
    } else if (!increment && stats[stat] > 0) {
      setStats({ ...stats, [stat]: stats[stat] - 1 });
      setRemainingPoints(remainingPoints + 1);
    }
  };

  const handleSubmit = () => {
    const data = {
      story: location.state.story,
      status: {
        player_name: name,
        player_description: description,
        stats: stats
      }
    }

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
        navigate("/main", { state: data })
      });
    console.log(data)
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
