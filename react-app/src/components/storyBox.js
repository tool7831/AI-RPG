import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

function StoryBox({ story, choices, handleChoice }) {
  return (
    <Container maxWidth="sm" sx={{ backgroundColor: 'whitesmoke', padding: 2, borderRadius: 2,}}>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2, textAlign: 'left', mb: 3, }}>
        <Typography variant="h6" gutterBottom sx={{}}> Story </Typography>
        <Typography variant="body1">{story}</Typography>
      </Box>
      {choices && choices.map((choice, index) => (
        <Button
          key={index}
          variant="contained"
          fullWidth
          sx={{ mb: 2, backgroundColor: '#d3d3d3', color:'black' }}
          onClick={() => handleChoice(index)}
        >
          <p>{choice.text}</p>
          {Object.keys(choice.status).map((key) => (
            <p key={key}>{key}: {choice.status[key]}</p>
          ))}
          {/* <p>{choice.gold}</p>
          <p>{choice.next_type}</p> */}
        </Button>
      ))}
    </Container>
  );
};

export default StoryBox;