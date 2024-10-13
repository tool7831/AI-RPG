import React from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import { StatIcons, StatusEffectIcons, SkillIcons } from './icons';

const iconStyle = {
  width: '30px',
  height: '30px',
  marginLeft: '10px',
}

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
}

export function AttackBox({ skill, status, ...props }) {
  return (
    <Paper {...props}>
      <Box sx={flexRow}>
        <Typography variant="h5">{skill.name}</Typography>
        <SkillIcons type={skill.type} style={iconStyle} />
      </Box>
      <Grid container>
        <Grid item xs={12} xl={6}>
          <Typography variant="body1">
            Damage {status ? `= ${skill.getTotalDamage(status)}` : null}
            ({skill.defaultDamage} + {Object.keys(skill.coef).map((key, idx) => (
              <>
                <StatIcons type={key} key={idx} /> x {skill.coef[key]}
              </>
            ))}) x {skill.count}
          </Typography>
          <Typography variant="body1">Penetration: {skill.penetration}%</Typography>
          <Typography variant="body1">Accuracy: {skill.accuracy}%</Typography>
          <Typography variant="body1">Cooldown: {skill.cooldown} Turn</Typography>
        </Grid>
        <Grid item xs={12} xl={6} >
          {skill.statusEffect && (
            <>
              <Box sx={flexRow}>
                <Typography mr={1} variant="h6">Status Effect </Typography>
                <StatusEffectIcons type={skill.statusEffect.type} style={{ width: '30px', height: '30px' }} />
              </Box>
              <Typography variant="body1">Value: {status ? `${skill.statusEffect.getTotalValue(status)}` : null}
                ({skill.statusEffect.defaultValue} + {Object.keys(skill.statusEffect.coef).map((key) => (
                  <>
                    <StatIcons type={key} key={key} /> x {skill.statusEffect.coef[key]}
                  </>
                ))})
              </Typography>
              <Typography variant="body1">Duration: {skill.statusEffect.duration} Turn</Typography>
              <Typography variant="body1">Accuracy: {skill.statusEffect.accuracy}%</Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export function DefendBox({ skill, status, ...props }) {
  return (
    <Paper {...props}>
      <Box sx={flexRow}>
        <Typography variant="h5">{skill.name}</Typography>
        <SkillIcons type={skill.type} style={iconStyle} />
      </Box>
      <Typography variant="body1">Value: {status ? `${skill.getTotalValue(status)}` : null}
        ({skill.defaultValue} + {Object.keys(skill.coef).map((key, idx) => (
          <>
            <StatIcons type={key} key={idx} /> x {skill.coef[key]}
          </>
        ))})
      </Typography>
      <Typography variant="body1">Duration: {skill.duration}</Typography>
      <Typography variant="body1">Cooldown: {skill.cooldown}</Typography>
    </Paper>
  )
}

export function SmiteBox({ skill, status, ...props }) {
  return (
    <Paper {...props}>
      <Box sx={flexRow}>
        <Typography variant="h5">{skill.name}</Typography>
        <SkillIcons type={skill.type} style={iconStyle} />
      </Box>
      <Typography variant="body1">Value: {status ? `${skill.getTotalValue(status)}` : null}
        ({skill.defaultValue} + {Object.keys(skill.coef).map((key, idx) => (
          <>
            <StatIcons type={key} key={idx}  /> x {skill.coef[key]}
          </>
        ))})
      </Typography>
      <Typography variant="body1">Duration: {skill.duration}</Typography>
      <Typography variant="body1">Cooldown: {skill.cooldown}</Typography>
    </Paper>
  )
}
