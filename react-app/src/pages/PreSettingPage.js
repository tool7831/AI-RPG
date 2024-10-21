import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, Tabs, Tab, TextField } from '@mui/material';


function PreSettingPage({handleData}) {
  const [story, setStory] = useState({});
  const [selectedStory, setSelectedStory] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const data = { user_id: "test" }
    setIsLoading(true);
    fetch(process.env.REACT_APP_FAST_API_URL + '/worldview', {
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
        setIsLoading(false);
      });
  }, [])

  const handleSubmit = () => {
    const data = {
      story: {
        text: story[selectedStory]
      }
    };
    handleData(data.story);
    // navigate("/player", { state: data })
    console.log(data)
  };
  const handleStoryToggle = (key) => {
    setSelectedStory(key)
  }

  const handleCancel = () => {
    setSelectedStory(null);
  }

  const handleTabChange = (event, value) => {
    setSelectedTab(value)
  }

  if(isLoading) {
    return <p>Loading ... </p>
  }

  return (
    <Container>
      {!selectedStory && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Story</h1>
        <div>
          {Object.keys(story).map((key) => (
            <Paper
              key={key}
              elevation={selectedStory === key ? 8 : 1}
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
              <Typography>{story[key]['summary']}</Typography>
            </Paper>
          ))}
          
        </div>
      </Box>
      }
      
        {selectedStory && (
          <Box>
            <Box>
              <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                <Tab value={0} label='1~25'/>
                <Tab value={1} label='26~50'/>
                <Tab value={2} label='51~75'/>
                <Tab value={3} label='76~100'/>
              </Tabs>
              <TextField
                fullWidth
                multiline
                row={20}
                defaultValue={"Story"}
                value={story[selectedStory][selectedTab]}
              />
            </Box>
            <Button sx={{ margin: 2 }} variant='contained' onClick={handleCancel} >Cancel</Button>
            <Button sx={{ margin: 2 }} variant='contained' onClick={handleSubmit} disabled={!selectedStory}>Submit</Button>
          </Box>
        )}

    </Container>
);
}

export default PreSettingPage;
