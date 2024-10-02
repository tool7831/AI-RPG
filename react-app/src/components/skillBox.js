import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { StatIcons, StatusEffectIcons } from './icons';

const iconStyle = {
  width: '30px',
  height: '30px',
  marginLeft: '10px',
}

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
}

export function AttackBox({ skill, status }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={flexRow}>
          <Typography variant="h5">{skill.name}</Typography>
          <StatIcons type={skill.type === 'melee' ? 'strength' : 'intelligence'} style={iconStyle} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              Damage {status ? `= ${skill.getTotalDamage(status)}` : null}
              ({skill.defaultDamage} + {Object.keys(skill.coef).map((key) => (
                <>
                  <StatIcons type={key} /> x {skill.coef[key]}
                </>
              ))}) x {skill.count}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Penetration: {skill.penetration}%</Typography>
            <Typography variant="body1">Accuracy: {skill.accuracy}%</Typography>
            <Typography variant="body1">Cooldown: {skill.cooldown} Turn</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {skill.statusEffect && (
          <>
            <Box sx={flexRow}>
              <Typography mr={1} variant="h6" gutterBottom>Status Effect </Typography>
              <StatusEffectIcons type={skill.statusEffect.type} style={{ width: '30px', height: '30px' }} />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">Value: {status ? `${skill.statusEffect.getTotalValue(status)}` : null}
                  ({skill.statusEffect.defaultValue} + {Object.keys(skill.statusEffect.coef).map((key) => (
                    <>
                      <StatIcons type={key} /> x {skill.statusEffect.coef[key]}
                    </>
                  ))})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Duration: {skill.statusEffect.duration} Turn</Typography>
                <Typography variant="body1">Accuracy: {skill.statusEffect.accuracy}%</Typography>
              </Grid>
            </Grid>
          </>
        )}

      </Grid>
    </Grid>
  )
}

export function DefendBox({ skill, status }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={flexRow}>
          <Typography variant="h5">{skill.name}</Typography>
          <StatIcons type={skill.type} style={iconStyle} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Value: {status ? `${skill.getTotalValue(status)}` : null}
              ({skill.defaultValue} + {Object.keys(skill.coef).map((key) => (
                <>
                  <StatIcons type={key} /> x {skill.coef[key]}
                </>
              ))})
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Duration: {skill.duration}</Typography>
            <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export function SmiteBox({ skill, status }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={flexRow}>
          <Typography variant="h5">{skill.name}</Typography>
          <StatIcons type={skill.type} style={iconStyle} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">Value: {status ? `${skill.getTotalValue(status)}` : null}
              ({skill.defaultValue} + {Object.keys(skill.coef).map((key) => (
                <>
                  <StatIcons type={key} /> x {skill.coef[key]}
                </>
              ))})
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Duration: {skill.duration}</Typography>
            <Typography variant="body2">Cooldown: {skill.cooldown}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
