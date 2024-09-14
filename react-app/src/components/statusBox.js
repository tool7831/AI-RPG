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
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}


function StatusBox({ status, maxWidth = 'sm', isPlayer }) {

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
          <Typography variant="body2">Strength: {status.status.strength} ({status.added_status.strength})</Typography>
          <Typography variant="body2">Speed: {status.status.speed} ({status.added_status.speed})</Typography>
          <Typography variant="body2">Dexterity: {status.status.dexterity} ({status.added_status.dexterity})</Typography>
          <Typography variant="body2">Concentration: {status.status.concentration} ({status.added_status.concentration})</Typography>
          <Typography variant="body2">Intelligence: {status.status.intelligence} ({status.added_status.intelligence})</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Reaction: {status.status.reaction} ({status.added_status.reaction})</Typography>
          <Typography variant="body2">Luck: {status.status.luck} ({status.added_status.luck})</Typography>
          <Typography variant="body2">Defense: {status.status.defense} ({status.added_status.Defense})</Typography>
          <Typography variant="body2">HP Regeneration: {status.status.hp_regeneration} ({status.added_status.hp_regeneration})</Typography>
          <Typography variant="body2">MP Regeneration: {status.status.mp_regeneration} ({status.added_status.mp_regeneration})</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {/* {isPlayer && <Typography variant="body2">EXP:{status.status.EXP} / {status.origin_status.EXP}</Typography>}
            {isPlayer && <LinearProgress variant="determinate" value={status.status.EXP * 100 / status.origin_status.EXP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />} */}
              {status.status.shield !== 0 && <Typography variant="body2" mt={1}>Shield:{status.status.shield} / {status.origin_status.shield}</Typography>}
              {status.status.shield !== 0 && <LinearProgress variant="determinate" value={status.status.shield * 100 / status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />}
              <Typography variant="body2" mt={1}>HP:{status.status.hp} / {status.origin_status.hp}</Typography>
              <LinearProgress variant="determinate" value={status.status.hp * 100 / status.origin_status.hp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Typography variant="body2" mt={1}>MP:{status.status.mp} / {status.origin_status.mp}</Typography>
              <LinearProgress variant="determinate" value={status.status.mp * 100 / status.origin_status.mp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
      <Modal open={inventoryVisible} onClose={handleInventoryToggle}>
        <div style={style}>
          <Inventory/>
        </div>
        
      </Modal>

    </Container>
  );
}

export default StatusBox;