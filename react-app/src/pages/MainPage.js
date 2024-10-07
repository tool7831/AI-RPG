import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';

function MainPage() {
  const navigate = useNavigate()
  const handleNewStart = () => {
    navigate('/select')
  }
  const handleLoad = () => {
    fetch('http://localhost:8000/load_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')) {
          navigate('/combat')
        } else {
          navigate('/story')
        }
      });
  }
  return (
    <Container>
      <Button onClick={handleNewStart}>New Start</Button>
      <Button onClick={handleLoad}>Load</Button>
    </Container>
  )
}

export default MainPage