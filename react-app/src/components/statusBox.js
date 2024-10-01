import React, { useState } from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container, Modal, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Inventory from './inventory';
import Status from './status';

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

function StatusBox({ actor, isPlayer, maxWidth = 'sm'}) {

  const [selectedTab, setSelectedTab] = useState(0);
  
  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
    setSelectedTab(0);
  };

  const handleTabChange= (event, value) => {
    setSelectedTab(value);
  }

  const [inventoryVisible, setInventoryVisible] = useState(false);

  return (
    <Container maxWidth={maxWidth} sx={{ padding: 2, backgroundColor: "whitesmoke", minWidth: '550px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6">Status</Typography>
          {isPlayer && <Typography>Level: {actor.level}</Typography>}
        </Box>
        {isPlayer && <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleInventoryToggle} >Inventory</Button>}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Strength: {actor.status.status.strength} ({formatStat(actor.status.added_status.strength)})</Typography>
          <Typography variant="body2">Speed: {actor.status.status.speed} ({formatStat(actor.status.added_status.speed)})</Typography>
          <Typography variant="body2">Dexterity: {actor.status.status.dexterity} ({formatStat(actor.status.added_status.dexterity)})</Typography>
          <Typography variant="body2">Concentration: {actor.status.status.concentration} ({formatStat(actor.status.added_status.concentration)})</Typography>
          <Typography variant="body2">Intelligence: {actor.status.status.intelligence} ({formatStat(actor.status.added_status.intelligence)})</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Reaction: {actor.status.status.reaction} ({formatStat(actor.status.added_status.reaction)})</Typography>
          <Typography variant="body2">Luck: {actor.status.status.luck} ({formatStat(actor.status.added_status.luck)})</Typography>
          <Typography variant="body2">Defense: {actor.status.status.defense} ({formatStat(actor.status.added_status.defense)})</Typography>
          <Typography variant="body2">HP Regeneration: {actor.status.status.hp_regeneration} ({formatStat(actor.status.added_status.hp_regeneration)})</Typography>
          <Typography variant="body2">MP Regeneration: {actor.status.status.mp_regeneration} ({formatStat(actor.status.added_status.mp_regeneration)})</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {isPlayer && <Typography variant="body2">EXP:{actor.exp} / {actor.nextExp}</Typography>}
              {isPlayer && <LinearProgress variant="determinate" value={actor.exp * 100 / actor.nextExp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />}
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
          <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab value={0} label='Inventory'/>
            <Tab value={1} label='Status'/>
          </Tabs>
          <Button variant='contained' onClick={handleInventoryToggle} sx={{position:' absolute', top:"0%", right:"0%"}}>Close</Button>
          {selectedTab === 0 && <Inventory actor={actor}/>}
          {selectedTab === 1 && <Status actor={actor}/>}
        </div>
      </Modal>)}


    </Container>
  );
}

export default StatusBox;