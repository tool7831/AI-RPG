import React from 'react';
import {Typography, Grid, LinearProgress, Box, Button, Container } from '@mui/material';

function StatusBox({ status, handleInventoryToggle }) {
  return (
    <Container maxWidth="sm" sx={{margin:2, padding:2, backgroundColor:"whitesmoke"}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
        <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleInventoryToggle} >Inventory</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Strength: {status.status.Strength}</Typography>
          <Typography variant="body2">Speed: {status.status.Speed}</Typography>
          <Typography variant="body2">Dexterity: {status.status.Dexterity}</Typography>
          <Typography variant="body2">Concentration: {status.status.Concentration}</Typography>
          <Typography variant="body2">Intelligence: {status.status.Intelligence}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Reaction: {status.status.Reaction}</Typography>
          <Typography variant="body2">Luck: {status.status.Luck}</Typography>
          <Typography variant="body2">Defense: {status.status.Defense}</Typography>
          <Typography variant="body2">HP Regeneration: {status.status.HP_Regeneration}</Typography>
          <Typography variant="body2">MP Regeneration: {status.status.MP_Regeneration}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="body2">EXP:{status.status.EXP} / {status.max_status.EXP}</Typography>
            <LinearProgress variant="determinate" value={status.status.EXP * 100 / status.max_status.EXP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="success" />
            <Typography variant="body2" mt={1}>HP:{status.status.HP} / {status.max_status.HP}</Typography>
            <LinearProgress variant="determinate" value={status.status.HP * 100 / status.max_status.HP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="error" />
            <Typography variant="body2" mt={1}>MP:{status.status.MP} / {status.max_status.MP}</Typography>
            <LinearProgress variant="determinate" value={status.status.MP * 100 / status.max_status.MP} sx={{ width: '100%', height: 10, borderRadius: 5 }} color="info" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StatusBox;