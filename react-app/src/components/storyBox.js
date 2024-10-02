import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import {StatIcons} from './icons.js'

function StoryBox({ story, choices, handleChoice }) {
  return (
    <Container maxWidth="sm" sx={{ backgroundColor: 'whitesmoke', padding: 2, borderRadius: 2 }}>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2, textAlign: 'left', mb: 3 }}>
        <Typography variant="h6" gutterBottom> Story </Typography>
        <Typography variant="body1">{story}</Typography>
      </Box>
      {choices && choices.map((choice, index) => (
        <Button
          key={index}
          variant="contained"
          fullWidth
          sx={{ mb: 2, backgroundColor: '#d3d3d3', color: 'black', textTransform:'none' }}
          onClick={() => handleChoice(index)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <p>{choice.text}</p>

            {/* 상태 값 아이콘 및 수치 표시 */}
            {Object.keys(choice.status).map((key) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                {<StatIcons type={key} />|| <Typography sx={{textTransform:'capitalize'}}>{key}: </Typography>} {/* 아이콘이 있으면 표시 */}
                <Typography>{choice.status[key]}</Typography>
              </Box>
            ))}
          </Box>
        </Button>
      ))
      }
    </Container >
  );
}

export default StoryBox;
