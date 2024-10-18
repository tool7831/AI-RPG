import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { StatIcons } from './icons.js';

function StoryBox({ story, choices, handleChoice, streamDone, sx ={}, ...props }) {

  const defaultSx = {
    width: "70%",
    padding: 2, 
    borderRadius: 2,
    border: 'solid 1 #ddd'
  };
  const mergedSx = { ...defaultSx, ...sx };
  return (
    <Paper 
      sx={mergedSx}
      {...props}
    >
      <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2, textAlign: 'left', mb: 3 }}>
        <Typography variant="h6" gutterBottom> Story </Typography>
        <Typography variant="body1">{story}</Typography>
      </Box>
      {Array.isArray(choices) && choices.length > 0 && choices.map((choice, index) => (
        // choice가 유효한지 확인
        choice && typeof choice === 'object' && (
          <Button
            key={index}
            variant="contained"
            fullWidth
            disabled={!streamDone}
            sx={{ mb: 2, backgroundColor: '#d3d3d3', color: 'black', textTransform:'none' }}
            onClick={() => handleChoice(index)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <p>{choice?.text}</p>

              {/* 상태 값 아이콘 및 수치 표시 */}
              {choice.status && typeof choice.status === 'object' && Object.keys(choice.status).map((key) => (
                choice.status[key] !== null && 
                <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                  {<StatIcons type={key} /> ? <StatIcons type={key} /> : <Typography sx={{ textTransform: 'capitalize' }}>{key}: </Typography>}
                  <Typography>{choice.status[key]}</Typography>
                </Box>
              ))}
            </Box>
          </Button>
        )
      ))}
    </Paper >
  );
}

export default StoryBox;
