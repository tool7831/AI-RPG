import React, { useState } from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container, Modal, Tab, Tabs } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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


function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function StatusBox({ actor, isPlayer, sx={}, ...props}) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const defaultSx = {
    padding: 2,
    backgroundColor: "whitesmoke",
  };
  const mergedSx = { ...defaultSx, ...sx };

  return (
    <Container sx={mergedSx} {...props} >
      <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
        {isPlayer && <Typography>Level: {actor.level}</Typography>}
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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="body2" mt={1}>Shield:{actor.status.status.shield} / {actor.status.origin_status.shield}</Typography>
                  <StatIcons type='shield' style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
                </Box>
              )}
              {actor.status.status.shield !== 0 && <LinearProgress variant="determinate" value={actor.status.status.shield * 100 / actor.status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2" mt={1}>HP:{actor.status.status.hp} / {actor.status.origin_status.hp}</Typography>
                <StatIcons type='hp' style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
              </Box>
              <LinearProgress variant="determinate" value={actor.status.status.hp * 100 / actor.status.origin_status.hp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2" mt={1}>MP:{actor.status.status.mp} / {actor.status.origin_status.mp}</Typography>
                <StatIcons type='mp' style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
              </Box>
              <LinearProgress variant="determinate" value={actor.status.status.mp * 100 / actor.status.origin_status.mp} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StatusBox;