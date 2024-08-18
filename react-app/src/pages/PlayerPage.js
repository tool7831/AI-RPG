import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './PlayerPage.css';
import { Container, TextField, Typography, Button, Box, Grid, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skills, setSkills] = useState([]);

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

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prevSelected) =>
      prevSelected.includes(skillId)
        ? prevSelected.filter((id) => id !== skillId)
        : [...prevSelected, skillId]
    );
  };

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      if (stat === "HP" || stat === "MP") {
        setStats({ ...stats, [stat]: stats[stat] + 10 });
        setRemainingPoints(remainingPoints - 1);
      }
      else if (stat === "HP_Regeneration" || stat === "MP_Regeneration") {
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
      if (stat === "HP" || stat === "MP") {
        setStats({ ...stats, [stat]: stats[stat] - 10 });
        setRemainingPoints(remainingPoints + 1);
      }
      else if ((stat === "HP_Regeneration" || stat === "MP_Regeneration")) {
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
          max_status: { ...stats },
          added_status: Object.keys(stats).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {})
        },
        attacks: selectedSkills.map((idx) => skills[idx])
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

    <Container>
      {/* Player Name and Description */}
      <TextField
        label="Player Name"
        fullWidth
        margin="normal"
        onChange={setName}
      />
      <TextField
        label="Player Description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        onChange={setDescription}
      />
      <Grid container spacing={4}>
        {/* Allocate Stats Section */}
        <Grid item xs={6}>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Allocate Stats</Typography>
            <Typography variant="body1">Remaining Points: {remainingPoints}</Typography>
            {Object.keys(stats).map((stat) => (
              <Box display="flex" alignItems="center" key={stat} mb={2}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>{stat}</Typography>
                <IconButton
                  onClick={() => handleStatChange(stat, false)}
                  disabled={stats[stat] <= 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{stats[stat]}</Typography>
                <IconButton
                  onClick={() => handleStatChange(stat, true)}
                  disabled={remainingPoints <= 0}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>
        {/* Skills Selection */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              {skills.map((skill, index) => (
                <Paper
                  key={index}
                  elevation={selectedSkills.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    width: '100%',
                    cursor: 'pointer',
                    border: selectedSkills.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedSkills.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleSkillToggle(index)}
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
              ))}
            </Box>
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
