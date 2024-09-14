import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './PlayerPage.css';
import { Container, TextField, Typography, Button, Box, Grid, Paper, IconButton, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const initialStats = {
  hp: 100,
  mp: 100,
  shield: 0,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  luck: 10,
  defense: 10,
  speed: 10,
  concentration: 10,
  reaction: 10,
  hp_regeneration: 0,
  mp_regeneration: 0,
};

function PlayerPage() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [stats, setStats] = useState(initialStats);
  const [remainingPoints, setRemainingPoints] = useState(0);

  const [skills, setSkills] = useState([]);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [selectedDefends, setSelectedDefends] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/skills', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setSkills(data);
      });
  }, [])

  const handleAttackToggle = (skillId) => {
    setSelectedAttacks((prevSelected) =>
      prevSelected.includes(skillId)
        ? prevSelected.filter((id) => id !== skillId)
        : [...prevSelected, skillId]
    );
  };

  const handleDefendToggle = (skillId) => {
    setSelectedDefends((prevSelected) =>
      prevSelected.includes(skillId)
        ? prevSelected.filter((id) => id !== skillId)
        : [...prevSelected, skillId]
    );
  };

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      if (stat === "hp" || stat === "mp" || stat === "shield") {
        setStats({ ...stats, [stat]: stats[stat] + 10 });
        setRemainingPoints(remainingPoints - 1);
      }
      else if (stat === "hp_regeneration" || stat === "mp_regeneration") {
        if (remainingPoints >= 10) {
          setStats({ ...stats, [stat]: stats[stat] + 1 });
          setRemainingPoints(remainingPoints - 10);
        }
      }
      else {
        setStats({ ...stats, [stat]: stats[stat] + 1 });
        setRemainingPoints(remainingPoints - 1);
      }

    } else if (!increment && stats[stat] > 0) {
      if (stat === "hp" || stat === "mp") {
        setStats({ ...stats, [stat]: stats[stat] - 10 });
        setRemainingPoints(remainingPoints + 1);
      }
      else if ((stat === "hp_regeneration" || stat === "mp_regeneration")) {
        setStats({ ...stats, [stat]: stats[stat] - 1 });
        setRemainingPoints(remainingPoints + 10);
      }
      else {
        setStats({ ...stats, [stat]: stats[stat] - 1 });
        setRemainingPoints(remainingPoints + 1);
      }
    }
  };

  const handleClassChange = (event, newValue) => {
    setSelectedClass(newValue);
    setSelectedAttacks([]);
    setSelectedDefends([]);
  };

  const handleSubmit = () => {
    const data = {
      story: location.state.story,
      player: {
        name: name,
        description: description,
        status: {
          status: stats,
          origin_status: { ...stats },
          added_status: Object.keys(stats).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {})
        },
        attacks: selectedAttacks.map((idx) => skills[selectedClass].attack[idx]),
        defends: selectedDefends.map((idx) => skills[selectedClass].defend[idx])
      }
    }
    console.log(data)

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
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Player Name and Description */}
          <TextField label="Player Name" fullWidth margin="normal" onChange={(e) => setName(e.target.value)}/>
          <TextField label="Player Description" fullWidth margin="normal" multiline rows={4} onChange={(e) => setDescription(e.target.value)} />

          {/* Allocate Stats Section */}
          <Box mb={4}> 
            <Typography variant="h6" gutterBottom>Allocate Stats</Typography>
            <Typography variant="body1">Remaining Points: {remainingPoints}</Typography>
            {Object.keys(stats).map((stat) => (
              <Box display="flex" alignItems="center" key={stat} mb={2}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>{stat}</Typography>
                <IconButton onClick={() => handleStatChange(stat, false)} disabled={stats[stat] <= 0} > <RemoveIcon /> </IconButton>
                <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{stats[stat]}</Typography>
                <IconButton onClick={() => handleStatChange(stat, true)} disabled={remainingPoints <= 0}> <AddIcon /> </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>
        {/* Skills Selection */}
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Tabs value={selectedClass} onChange={handleClassChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ mb: 2 }} >
            {skills.map((skillClass, index) => (
              <Tab key={index} label={skillClass.class_name} />
            ))}
          </Tabs>
          <Grid container spacing={2}>
            {/* Attack Skills */}
            <Grid item xs={12}><Typography variant="h6">Attack Skills</Typography></Grid>
            {skills[selectedClass] && skills[selectedClass].attack.map((skill, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  key={index}
                  elevation={selectedAttacks.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedAttacks.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedAttacks.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleAttackToggle(index)}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6">{skill.name}</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Type: {skill.type}</Typography>
                          <Typography variant="body2">Default Damage: {skill.defaultDamage}</Typography>
                          <Typography variant="body2">
                            Coefficient: {Object.keys(skill.coef).map((key) => `${key}: ${skill.coef[key]}`).join(', ')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Count: {skill.count}</Typography>
                          <Typography variant="body2">Penetration: {skill.penetration}</Typography>
                          <Typography variant="body2">Accuracy: {skill.accuracy}</Typography>
                          <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      {skill.statusEffect && (
                        <>
                          <Typography variant="h6" gutterBottom>Status Effect</Typography>
                          <Typography variant="body2">Type: {skill.statusEffect.type}</Typography>
                          <Typography variant="body2">Duration: {skill.statusEffect.duration}</Typography>
                          <Typography variant="body2">Default Value: {skill.statusEffect.defaultValue}</Typography>
                          <Typography variant="body2">
                            Coefficient: {Object.keys(skill.statusEffect.coef).map((key) => `${key}: ${skill.statusEffect.coef[key]}`).join(', ')}
                          </Typography>
                          <Typography variant="body2">Accuracy: {skill.statusEffect.accuracy}</Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
            {/* Defend Skills */}
            <Grid item xs={12} mt={4}><Typography variant="h6">Defend Skills</Typography></Grid>
            {skills[selectedClass] && skills[selectedClass].defend.map((skill, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={selectedDefends.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedDefends.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedDefends.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleDefendToggle(index)}
                >
                  <Typography variant="h6">{skill.name}</Typography>
                  <Typography variant="body2">Type: {skill.type}</Typography>
                  <Typography variant="body2">Default Value: {skill.defaultValue}</Typography>
                  <Typography variant="body2">
                    Coefficient: {Object.keys(skill.coef).map((key) => `${key}: ${skill.coef[key]}`).join(', ')}
                  </Typography>
                  <Typography variant="body2">Duration: {skill.duration}</Typography>
                  <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
                  <Typography variant="body2">Current Cooldown: {skill.curCooldown}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
        
      </Grid>
    </Container>
  );
}

export default PlayerPage;
