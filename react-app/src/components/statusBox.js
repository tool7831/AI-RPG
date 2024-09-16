import React, { useState } from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container, Modal } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Inventory from './inventory';

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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height:800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  backgroundColor: 'white'
};

function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}


function StatusBox({ actor, maxWidth = 'sm', isPlayer }) {

  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
  };

  const [inventoryVisible, setInventoryVisible] = useState(false);

  return (
    <Container maxWidth={maxWidth} sx={{ padding: 2, backgroundColor: "whitesmoke" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
        {isPlayer && <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleInventoryToggle} >Inventory</Button>}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Strength: {actor.status.status.strength} ({actor.status.added_status.strength})</Typography>
          <Typography variant="body2">Speed: {actor.status.status.speed} ({actor.status.added_status.speed})</Typography>
          <Typography variant="body2">Dexterity: {actor.status.status.dexterity} ({actor.status.added_status.dexterity})</Typography>
          <Typography variant="body2">Concentration: {actor.status.status.concentration} ({actor.status.added_status.concentration})</Typography>
          <Typography variant="body2">Intelligence: {actor.status.status.intelligence} ({actor.status.added_status.intelligence})</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Reaction: {actor.status.status.reaction} ({actor.status.added_status.reaction})</Typography>
          <Typography variant="body2">Luck: {actor.status.status.luck} ({actor.status.added_status.luck})</Typography>
          <Typography variant="body2">Defense: {actor.status.status.defense} ({actor.status.added_status.defense})</Typography>
          <Typography variant="body2">HP Regeneration: {actor.status.status.hp_regeneration} ({actor.status.added_status.hp_regeneration})</Typography>
          <Typography variant="body2">MP Regeneration: {actor.status.status.mp_regeneration} ({actor.status.added_status.mp_regeneration})</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {/* {isPlayer && <Typography variant="body2">EXP:{actor.status.status.EXP} / {actor.status.origin_status.EXP}</Typography>}
            {isPlayer && <LinearProgress variant="determinate" value={actor.status.status.EXP * 100 / actor.status.origin_status.EXP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />} */}
              {actor.status.status.shield !== 0 && <Typography variant="body2" mt={1}>Shield:{actor.status.status.shield} / {actor.status.origin_status.shield}</Typography>}
              {actor.status.status.shield !== 0 && <LinearProgress variant="determinate" value={actor.status.status.shield * 100 / actor.status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />}
              <Typography variant="body2" mt={1}>HP:{actor.status.status.hp} / {actor.status.origin_status.hp}</Typography>
              <LinearProgress variant="determinate" value={actor.status.status.hp * 100 / actor.status.origin_status.hp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Typography variant="body2" mt={1}>MP:{actor.status.status.mp} / {actor.status.origin_status.mp}</Typography>
              <LinearProgress variant="determinate" value={actor.status.status.mp * 100 / actor.status.origin_status.mp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
      {isPlayer && (<Modal open={inventoryVisible}>
        <div style={style}>
          <Inventory actor={actor} handleInventoryToggle={handleInventoryToggle}/>
        </div>
      </Modal>)}

    </Container>
  );
}

export default StatusBox;