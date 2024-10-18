import React from 'react';
import { Typography, Grid, LinearProgress, Box, Paper } from '@mui/material';
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

function StatusBox({ actor = {}, isPlayer, streamDone = true , sx = {}, ...props }) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const defaultSx = {
    padding: 2,
    border: '1px solid #ddd',
    width: '100%',
  };
  const mergedSx = { ...defaultSx, ...sx };

  // 기본값을 할당해서 중간에 undefined가 있어도 오류 방지
  const status = streamDone ? actor.status?.status || {} : actor.status || {};
  const originStatus = actor.status?.origin_status || {};
  const addedStatus = actor.status?.added_status || {};
  const exp = actor?.exp || 0;
  const nextExp = actor?.nextExp || 1;

  return (
    <Paper sx={mergedSx} {...props}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Status</Typography>
        {isPlayer && <Typography>Level: {actor?.level || 1}</Typography>}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {Object.keys(status).map((key, index) => (
            index >= 3 && index < 8 && (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                <StatIcons type={key} />
                <Typography variant="body2" sx={{ marginLeft: '10px' }}>
                  {capitalize(key)}: {status[key]} ({formatStat(addedStatus[key] || 0)})
                </Typography>
              </Box>
            )
          ))}
        </Grid>
        <Grid item xs={6}>
          {Object.keys(status).map((key, index) => (
            index >= 8 && (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                <StatIcons type={key} />
                <Typography variant="body2" sx={{ marginLeft: '10px' }}>
                  {capitalize(key)}: {status[key]} ({formatStat(addedStatus[key] || 0)})
                </Typography>
              </Box>
            )
          ))}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <ThemeProvider theme={theme}>
              {isPlayer && (
                <Typography variant="body2">
                  EXP: {exp} / {nextExp}
                </Typography>
              )}
              {isPlayer && (
                <LinearProgress
                  variant="determinate"
                  value={(exp * 100) / nextExp}
                  sx={{ width: '100%', height: 10, borderRadius: 5 }}
                  color="success"
                />
              )}
              {status.shield !== undefined && status.shield !== 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="body2" mt={1}>
                    Shield: {status.shield} / {originStatus.shield}
                  </Typography>
                  <StatIcons type="shield" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
                </Box>
              )}
              {status.shield !== undefined && status.shield !== 0 && (
                <LinearProgress
                  variant="determinate"
                  value={(status.shield * 100) / originStatus.shield}
                  sx={{ width: '100%', height: 10, borderRadius: 5 }}
                  color="gray"
                />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2" mt={1}>
                  HP: {status.hp} / {originStatus.hp}
                </Typography>
                <StatIcons type="hp" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(status.hp * 100) / originStatus.hp}
                sx={{ width: '100%', height: 10, borderRadius: 5 }}
                color="error"
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2" mt={1}>
                  MP: {status.mp} / {originStatus.mp}
                </Typography>
                <StatIcons type="mp" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(status.mp * 100) / originStatus.mp}
                sx={{ width: '100%', height: 10, borderRadius: 5 }}
                color="info"
              />
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StatusBox;
