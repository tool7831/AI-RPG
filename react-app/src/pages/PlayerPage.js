import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Container, TextField, Typography, Button, Box, Grid, Paper, IconButton, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { AttackBox, DefendBox, SmiteBox } from '../components/skillBox';

import {fetchWithAuth} from '../components/api';

function PlayerPage({worldView, handleFetch, ...props}) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [stats, setStats] = useState({});
  const [remainingPoints, setRemainingPoints] = useState(0);

  const [classes, setClasses] = useState([]);
  const [selectedSkillType, setSelectedSkillType] = useState(0);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [selectedDefends, setSelectedDefends] = useState([]);
  const [selectedSmites, setSelectedSmites] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);

  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState(null);
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(null);

  const [openLoading, setOpenLoading] = useState(false);


  useEffect(() => {
    fetch('http://localhost:8000/skills', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setClasses(data);
        setStats(data[0].stats)
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
      else if (stat === "hp_regeneration") {
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
      else if ((stat === "hp_regeneration")) {
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
    setSelectedSkillType(0);
    setStats(classes[newValue].stats)
    setRemainingPoints(0);
  };

  const handleSkillChange = (event, newValue) => {
    setSelectedSkillType(newValue);
  }

  const handleSubmit = async () => {
    const data = {
      story: worldView,
      stage: 0,
      player: {
        name: name,
        description: description,
        level: 1,
        exp: 0,
        nextExp: 100,
        statPoints: 0,
        status: {
          status: stats,
          origin_status: { ...stats },
          added_status: Object.keys(stats).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {})
        },
        attacks: selectedAttacks.map((idx) => classes[selectedClass].attacks[idx]),
        defends: selectedDefends.map((idx) => classes[selectedClass].defends[idx]),
        smites: selectedSmites.map((idx) => classes[selectedClass].smites[idx]),
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

    handleFetch('http://localhost:8000/first',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  }

  const handleValid = () => {
    let isValid = true;

    if(!name) {
      setNameError(true);
      setNameErrorMessage('Please enter a name.');
      isValid = false;
    }
    else {
      setNameError(false);
      setNameErrorMessage('');
    }
      
    if(!description) {
      setDescriptionError(true);
      setDescriptionErrorMessage('Please enter a description.');
      isValid = false
    }
    else {
      setDescriptionError(false);
      setDescriptionErrorMessage('');
    }

    if (isValid)
      handleSubmit()
  }

  if(openLoading) {
    return <p>Loading ...</p>
  }

  return (
    <Container>
      <Grid container>
        <Grid item xs={6} sx={{ padding:'10px' }}>
          <Paper elevation={4} sx={{padding:'10px', border:'1px solid'}}>
          {/* Player Name and Description */}
          <TextField
            error={nameError}
            helperText={nameErrorMessage}
            id="name"
            type="name"
            name="name"
            label="Player Name" 
            fullWidth 
            margin="normal"
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            error={descriptionError}
            helperText={descriptionErrorMessage}
            id="description"
            type="description"
            name="description"
            label="Player Description" 
            fullWidth 
            margin="normal" 
            multiline 
            rows={4}
            onChange={(e) => setDescription(e.target.value)} 
          />

          {/* Allocate Stats Section */}
          <Paper elevation={0} sx={{ border: '1px solid #ddd', padding: '10px' }}>
            <Typography variant="h6" gutterBottom>Allocate Stats</Typography>
            <Typography variant="body1">Remaining Points: {remainingPoints}</Typography>
            {Object.keys(stats).map((stat) => (
              <Box display="flex" alignItems="center" key={stat} >
                <Typography variant="body2" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>{stat}</Typography>
                <IconButton onClick={() => handleStatChange(stat, false)} disabled={stats[stat] <= 0} > <RemoveIcon /> </IconButton>
                <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{stats[stat]}</Typography>
                <IconButton onClick={() => handleStatChange(stat, true)} disabled={remainingPoints <= 0}> <AddIcon /> </IconButton>
              </Box>
            ))}
          </Paper>
          </Paper>
        </Grid>
        {/* Skills Selection */}
        <Grid item xs={6} sx={{padding: '10px' }}>
          <Paper elevation={4} sx={{border:'1px solid', padding:'10px'}}>
          <Typography variant="h5" gutterBottom>Skills</Typography>
          <Tabs value={selectedClass} onChange={handleClassChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ mb: 2, border:'1px solid #ddd' }} >
            {classes.map((skillClass, index) => (
              <Tab key={index} label={skillClass.class_name} />
            ))}
          </Tabs>
          <Tabs value={selectedSkillType} onChange={handleSkillChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ mb: 2, border:'1px solid #ddd' }} >
            <Tab key={0} label={'Attack'} />
            <Tab key={1} label={'Defense'} />
            <Tab key={2} label={'Smite'} />
          </Tabs>

          <Grid container spacing={2}>
            {/* Attack Skills */}
            {selectedSkillType === 0 && classes[selectedClass] && classes[selectedClass].attacks.map((skill, index) => (
              <Grid item xs={12} key={index}>
                <AttackBox
                  skill={skill}
                  key={index}
                  elevation={selectedAttacks.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedAttacks.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedAttacks.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleAttackToggle(index)} 
                />
              </Grid>
            ))}
            {/* Defend Skills */}
            {selectedSkillType === 1 && classes[selectedClass] && classes[selectedClass].defends.map((skill, index) => (
              <Grid item xs={12} key={index}>
                <DefendBox
                  skill={skill}
                  elevation={selectedDefends.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedDefends.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedDefends.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleDefendToggle(index)}
                />
              </Grid>
            ))}

            {/* <Grid item xs={12} mt={4}><Typography variant="h6">Smite Skills</Typography></Grid> */}
            {selectedSkillType === 2 && classes[selectedClass] && classes[selectedClass].smites.map((skill, index) => (
              <Grid item xs={12} key={index}>

                <SmiteBox
                  skill={skill}
                  elevation={selectedSmites.includes(index) ? 8 : 1}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                    border: selectedSmites.includes(index) ? '2px solid #3f51b5' : '1px solid #ddd',
                    boxShadow: selectedSmites.includes(index) ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
                  }}
                  onClick={() => handleSmiteToggle(index)} 
                />
              </Grid>
            ))}
          </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleValid}>
          Submit
        </Button>
      </Box>

    </Container>
  );
}

export default PlayerPage;
