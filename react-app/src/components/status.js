import React, { useState } from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container, Modal, Tab, Tabs, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const theme = createTheme({
  palette: {
    gray: {
      main: '#DADADA',
      light: '#F2F2F2',
      dark: '#AEAEAE',
      contrastText: '#242105',
    },
  },
});

function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

const initialStats = {
  hp: 0,
  mp: 0,
  shield: 0,
  strength: 0,
  dexterity: 0,
  intelligence: 0,
  luck: 0,
  defense: 0,
  speed: 0,
  concentration: 0,
  reaction: 0,
  hp_regeneration: 0,
  mp_regeneration: 0,
};

function Status({ actor }) {

  const [stats, setStats] = useState(initialStats);
  const [remainingPoints, setRemainingPoints] = useState(actor.statPoints);

  const handleStatChange = (stat, increment) => {
    if (increment && remainingPoints > 0) {
      if (stat === "hp" || stat === "mp" || stat === "shield") {
        setStats({ ...stats, [stat]: stats[stat] + 10 })
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
            <Box display="flex" alignItems="center" key={stat} mb={0}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>{stat}</Typography>
              <IconButton onClick={() => handleStatChange(stat, false)} disabled={actor.status.origin_status[stat] + stats[stat] <= 0 || remainingPoints >= actor.statPoints || stats[stat] <= 0}> <RemoveIcon /> </IconButton>
              <Typography variant="body2" sx={{ width: 30, textAlign: 'center' }}>{actor.status.origin_status[stat] + stats[stat]}</Typography>
              <IconButton onClick={() => handleStatChange(stat, true)} disabled={remainingPoints <= 0}> <AddIcon /> </IconButton>
            </Box>
          ))}
          <Button onClick={handleStatConfirm}>Confirm</Button>
        </Grid>
        <Grid item xs={6}>
          <Typography>Level: {actor.level}</Typography>
          <Typography variant="body2">Strength: {actor.status.status.strength} ({formatStat(actor.status.added_status.strength)})</Typography>
          <Typography variant="body2">Speed: {actor.status.status.speed} ({formatStat(actor.status.added_status.speed)})</Typography>
          <Typography variant="body2">Dexterity: {actor.status.status.dexterity} ({formatStat(actor.status.added_status.dexterity)})</Typography>
          <Typography variant="body2">Concentration: {actor.status.status.concentration} ({formatStat(actor.status.added_status.concentration)})</Typography>
          <Typography variant="body2">Intelligence: {actor.status.status.intelligence} ({formatStat(actor.status.added_status.intelligence)})</Typography>
          <Typography variant="body2">Reaction: {actor.status.status.reaction} ({formatStat(actor.status.added_status.reaction)})</Typography>
          <Typography variant="body2">Luck: {actor.status.status.luck} ({formatStat(actor.status.added_status.luck)})</Typography>
          <Typography variant="body2">Defense: {actor.status.status.defense} ({formatStat(actor.status.added_status.defense)})</Typography>
          <Typography variant="body2">HP Regeneration: {actor.status.status.hp_regeneration} ({formatStat(actor.status.added_status.hp_regeneration)})</Typography>
          <Typography variant="body2">MP Regeneration: {actor.status.status.mp_regeneration} ({formatStat(actor.status.added_status.mp_regeneration)})</Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              <Typography variant="body2">EXP:{actor.exp} / {actor.nextExp}</Typography>
              <LinearProgress variant="determinate" value={actor.exp * 100 / actor.nextExp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />
              <Typography variant="body2" mt={1}>Shield:{actor.status.status.shield} / {actor.status.origin_status.shield}</Typography>
              <LinearProgress variant="determinate" value={actor.status.status.shield * 100 / actor.status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />
              <Typography variant="body2" mt={1}>HP:{actor.status.status.hp} / {actor.status.origin_status.hp}</Typography>
              <LinearProgress variant="determinate" value={actor.status.status.hp * 100 / actor.status.origin_status.hp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Typography variant="body2" mt={1}>MP:{actor.status.status.mp} / {actor.status.origin_status.mp}</Typography>
              <LinearProgress variant="determinate" value={actor.status.status.mp * 100 / actor.status.origin_status.mp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Status;