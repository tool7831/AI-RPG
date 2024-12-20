import React, { useState } from 'react';
import { Typography, Grid, Box, Button, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StatusBox from './statusBox';

const initialStats = {
  hp: 0,
  mp: 0,
  shield: 0,
  strength: 0,
  dexterity: 0,
  intelligence: 0,
  luck: 0,
  defense: 0,
  agility: 0,
  resistance: 0,
  toughness: 0,
  hp_regeneration: 0,
  mp_regeneration: 0,
};

function StatusTab({ actor }) {

  const [stats, setStats] = useState(
    Object.keys(actor.status.status).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {}));
  const [remainingPoints, setRemainingPoints] = useState(actor.statPoints);

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      if (stat === "hp" || stat === "mp" || stat === "shield") {
        setStats({ ...stats, [stat]: stats[stat] + 10 })
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

  const handleStatConfirm = () => {
    Object.keys(stats).forEach((stat) => {
      actor.status.changeOriginValue(stat, stats[stat])
    })
    actor.statPoints = remainingPoints;
    setStats(initialStats);
  }

  return (
    <Container sx={{maxHeight:'90%', overflowY:'auto'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
      </Box>
      <Typography variant="body1">Remaining Points: {remainingPoints}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {Object.keys(actor.status.status).map((stat) => (
            <Box display="flex" alignItems="center" key={stat}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>{stat}</Typography>
              <IconButton onClick={() => handleStatChange(stat, false)} disabled={actor.status.origin_status[stat] + stats[stat] <= 0 || remainingPoints >= actor.statPoints || stats[stat] <= 0}> <RemoveIcon /> </IconButton>
              <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{actor.status.origin_status[stat] + stats[stat]}</Typography>
              <IconButton onClick={() => handleStatChange(stat, true)} disabled={remainingPoints <= 0}> <AddIcon /> </IconButton>
            </Box>
          ))}
          <Button onClick={handleStatConfirm} variant='contained'>Confirm</Button>
        </Grid>
        <Grid item xs={6}>
          <StatusBox actor={actor} isPlayer={false} sx={{width:'90%'}}/>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StatusTab;