import React from 'react';
import { Typography, Grid, LinearProgress, Box, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function StatusBox({ status, handleInventoryToggle, maxWidth = 'sm', isPlayer }) {
  return (
    <Container maxWidth={maxWidth} sx={{ padding: 2, backgroundColor: "whitesmoke" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
        {isPlayer && <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleInventoryToggle} >Inventory</Button>}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Strength: {status.status.Strength} ({status.added_status.Strength})</Typography>
          <Typography variant="body2">Speed: {status.status.Speed} ({status.added_status.Speed})</Typography>
          <Typography variant="body2">Dexterity: {status.status.Dexterity} ({status.added_status.Dexterity})</Typography>
          <Typography variant="body2">Concentration: {status.status.Concentration} ({status.added_status.Concentration})</Typography>
          <Typography variant="body2">Intelligence: {status.status.Intelligence} ({status.added_status.Intelligence})</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Reaction: {status.status.Reaction} ({status.added_status.Reaction})</Typography>
          <Typography variant="body2">Luck: {status.status.Luck} ({status.added_status.Luck})</Typography>
          <Typography variant="body2">Defense: {status.status.Defense} ({status.added_status.Defense})</Typography>
          <Typography variant="body2">HP Regeneration: {status.status.HP_Regeneration} ({status.added_status.HP_Regeneration})</Typography>
          <Typography variant="body2">MP Regeneration: {status.status.MP_Regeneration} ({status.added_status.MP_Regeneration})</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {/* {isPlayer && <Typography variant="body2">EXP:{status.status.EXP} / {status.origin_status.EXP}</Typography>}
            {isPlayer && <LinearProgress variant="determinate" value={status.status.EXP * 100 / status.origin_status.EXP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />} */}
              {status.status.shield !== 0 && <Typography variant="body2" mt={1}>Shield:{status.status.shield} / {status.origin_status.shield}</Typography>}
              {status.status.shield !== 0 && <LinearProgress variant="determinate" value={status.status.shield * 100 / status.origin_status.shield} sx={{ width: '100%', height: 10, borderRadius: 5 }} color='gray' />}
              <Typography variant="body2" mt={1}>HP:{status.status.HP} / {status.origin_status.HP}</Typography>
              <LinearProgress variant="determinate" value={status.status.HP * 100 / status.origin_status.HP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
              <Typography variant="body2" mt={1}>MP:{status.status.MP} / {status.origin_status.MP}</Typography>
              <LinearProgress variant="determinate" value={status.status.MP * 100 / status.origin_status.MP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StatusBox;