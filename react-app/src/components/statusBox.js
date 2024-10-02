import React, { useState } from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container, Modal, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Inventory from './inventory';
import Status from './status';
import { StatIcons } from './icons';
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
  height: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  backgroundColor: 'white',
  overFlowY:'auto'
};

function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function StatusBox({ actor, isPlayer, maxWidth = 'sm' }) {

  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleInventoryToggle = () => {
    setInventoryVisible(!inventoryVisible);
    setSelectedTab(0);
  };

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
  }
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


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
          {Object.keys(actor.status.status).map((key, index) => (
            index >= 3 && index < 8 && (
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <StatIcons type={key} />
                <Typography variant="body2" key={key} sx={{ marginLeft: '10px' }}>
                  {capitalize(key)}: {actor.status.status[key]} ({formatStat(actor.status.added_status[key])})
                </Typography>
              </Box>
            )
          ))}
        </Grid>
        <Grid item xs={6}>
          {Object.keys(actor.status.status).map((key, index) => (
            index >= 8 && (
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <StatIcons type={key} />
                <Typography variant="body2" key={key} sx={{ marginLeft: '10px' }}>
                  {capitalize(key)}: {actor.status.status[key]} ({formatStat(actor.status.added_status[key])})
                </Typography>
              </Box>
            )
          ))}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {isPlayer && <Typography variant="body2">EXP:{actor.exp} / {actor.nextExp}</Typography>}
              {isPlayer && <LinearProgress variant="determinate" value={actor.exp * 100 / actor.nextExp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />}
              {actor.status.status.shield !== 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center' }}>
                  <Typography variant="body2" mt={1}>Shield:{actor.status.status.shield} / {actor.status.origin_status.shield}</Typography>
                  <StatIcons type='shield' style={{width:'20px', height:'20px',marginLeft:'5px'}} />
                </Box>
              )}
              {actor.status.status.shield !== 0 && <LinearProgress variant="determinate" value={actor.status.status.shield * 100 / actor.status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />}
              <Box sx={{ display: 'flex', flexDirection: 'row' , alignItems:'center' }}>
                <Typography variant="body2" mt={1}>HP:{actor.status.status.hp} / {actor.status.origin_status.hp}</Typography>
                <StatIcons type='hp' style={{width:'20px', height:'20px',marginLeft:'5px'}} />
              </Box>
              <LinearProgress variant="determinate" value={actor.status.status.hp * 100 / actor.status.origin_status.hp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Box sx={{ display: 'flex', flexDirection: 'row' , alignItems:'center' }}>
                <Typography variant="body2" mt={1}>MP:{actor.status.status.mp} / {actor.status.origin_status.mp}</Typography>
                <StatIcons type='mp' style={{width:'20px', height:'20px',marginLeft:'5px'}}/>
              </Box>
              <LinearProgress variant="determinate" value={actor.status.status.mp * 100 / actor.status.origin_status.mp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>


      {isPlayer && (<Modal open={inventoryVisible}>
        <div style={style}>
          <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab value={0} label='Inventory' />
            <Tab value={1} label='Status' />
          </Tabs>
          <Button variant='contained' onClick={handleInventoryToggle} sx={{ position: ' absolute', top: "0%", right: "0%" }}>Close</Button>
          {selectedTab === 0 && <Inventory actor={actor} />}
          {selectedTab === 1 && <Status actor={actor} />}
        </div>
      </Modal>)}


    </Container>
  );
}

export default StatusBox;