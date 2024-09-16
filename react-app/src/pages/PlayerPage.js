import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Container, TextField, Typography, Button, Box, Grid, Paper, IconButton, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { AttackBox, DefendBox, SmiteBox } from '../components/skillBox';


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
  const [selectedSkillType, setSelectedSkillType] = useState(0);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [selectedDefends, setSelectedDefends] = useState([]);
  const [selectedSmites, setSelectedSmites] = useState([]);
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

  const handleSmiteToggle = (skillId) => {
    setSelectedSmites((prevSelected) =>
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
      if (stat === "hp" || stat === "mp" || stat === "shield") {
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
    setSelectedSmites([]);
  };

  const handleSubmit = () => {
    const data = {
      story: location.state.story,
      player: {
        name: name,
        description: description,
        level:1,
        exp:0,
        nextExp:100,
        statPoints:0,
        status: {
          status: stats,
          origin_status: { ...stats },
          added_status: Object.keys(stats).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {})
        },
        attacks: selectedAttacks.map((idx) => skills[selectedClass].attacks[idx]),
        defends: selectedDefends.map((idx) => skills[selectedClass].defends[idx]),
        smites: selectedSmites.map((idx) => skills[selectedClass].smites[idx]),
        inventory: {
          items: [],
          equipments: {
            helmet: null,
            armor: null,
            pants: null,
            shoes: null,
            gloves: null,
            rightHand: null,
            leftHand: null,
            ring1: null,
            ring2: null,
            earring1: null,
            earring2: null,
            necklace: null,
          },
        },
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
            {skills[selectedClass] && skills[selectedClass].attacks.map((skill, index) => (
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
                  <AttackBox skill={skill}></AttackBox>
                </Paper>
              </Grid>
            ))}
            {/* Defend Skills */}
            <Grid item xs={12} mt={4}><Typography variant="h6">Defend Skills</Typography></Grid>
            {skills[selectedClass] && skills[selectedClass].defends.map((skill, index) => (
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
                  <DefendBox skill={skill}/>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12} mt={4}><Typography variant="h6">Smite Skills</Typography></Grid>
            {skills[selectedClass] && skills[selectedClass].smites.map((skill, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={selectedSmites.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedSmites.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedSmites.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleSmiteToggle(index)}
                >
                  <SmiteBox skill={skill}/>
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
