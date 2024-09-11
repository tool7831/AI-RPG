import React from 'react';
import { Typography, Grid} from '@mui/material';

export function AttackBox({ skill }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6">{skill.name}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Type: {skill.type}</Typography>
            <Typography variant="body2">Default Damage: {skill.defaultDamage}</Typography>
            <Typography variant="body2">
              Coefficient: {Object.keys(skill.coef).map((key) => `${key}: ${skill.coef[key]}`).join(', ')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Count: {skill.count}</Typography>
            <Typography variant="body2">Penetration: {skill.penetration}</Typography>
            <Typography variant="body2">Accuracy: {skill.accuracy}</Typography>
            <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {skill.statusEffect && (
          <>
            <Typography variant="h6" gutterBottom>Status Effect</Typography>
            <Typography variant="body2">Type: {skill.statusEffect.type}</Typography>
            <Typography variant="body2">Duration: {skill.statusEffect.duration}</Typography>
            <Typography variant="body2">Default Value: {skill.statusEffect.defaultValue}</Typography>
            <Typography variant="body2">
              Coefficient: {Object.keys(skill.statusEffect.coef).map((key) => `${key}: ${skill.statusEffect.coef[key]}`).join(', ')}
            </Typography>
            <Typography variant="body2">Accuracy: {skill.statusEffect.accuracy}</Typography>
          </>
        )}
      </Grid>
    </Grid>
  )
}

export function DefendBox({ skill }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{skill.name}</Typography>
        <Typography variant="body2">Type: {skill.type}</Typography>
        <Typography variant="body2">Default Value: {skill.defaultValue}</Typography>
        <Typography variant="body2">
          Coefficient: {Object.keys(skill.coef).map((key) => `${key}: ${skill.coef[key]}`).join(', ')}
        </Typography>
        <Typography variant="body2">Duration: {skill.duration}</Typography>
        <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
        <Typography variant="body2">Current Cooldown: {skill.curCooldown}</Typography>
      </Grid>
    </Grid>
  )
}
