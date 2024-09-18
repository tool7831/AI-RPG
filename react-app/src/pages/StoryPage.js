import { Container, Paper, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


function StoryPage() {
  const [story, setStory] = useState({});
  const [selectedStory, setSelectedStory] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const data = { session: "12312" }
    fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setStory(data)
      });
  }, [])

  const handleSubmit = () => {
    const data = {
      story: {
        text: story[selectedStory]
      }
    };
    navigate("/player", { state: data })
    console.log(data)
  };
  const handleStoryToggle = (key) => {
    setSelectedStory(key)
  }
  return (
    <div className="App">
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Story</h1>
        <div>
          {Object.keys(story).map((key) => (
            <Paper
              key={key}
              elevation={selectedStory===key ? 8 : 1}
              sx={{
                padding: 2,
                margin: 2,
                cursor: 'pointer',
                border: selectedStory === key ? '2px solid #3f51b5' : '1px solid #ddd',
                boxShadow: selectedStory === key ? '0 0 10px rgba(63, 81, 181, 0.5)' : 'none',
              }}
              onClick={() => handleStoryToggle(key)}
            >
              <Typography variant='h5'>{key}</Typography>
              <Typography>{story[key]}</Typography>
            </Paper>
          ))}
          <Button sx={{margin:2}} variant='contained' onClick={handleSubmit}>Submit</Button>
        </div>
      </Container>

    </div>
  );
}

export default StoryPage;
