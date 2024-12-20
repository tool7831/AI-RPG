import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Paper } from '@mui/material';
import {fetchWithAuth } from '../components/api';

function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth(process.env.REACT_APP_FAST_API_URL + '/users/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log(data)
        } else {
          // 인증 실패 시 로그인 페이지로 리다이렉트
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleNewStart = () => {
    navigate('/game', {state: {type: 0}});
    localStorage.setItem('isFirstStart', 'true');
  }
  const handleLoad = () => {
    navigate('/game', {state: {type: 1}});
    localStorage.setItem('isFirstStart', 'false');
  }
  const handleLanguage = () => {

  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', padding: '30px'}}>
      <Paper
        elevation={4}
        sx={{
          minWidth: '600px',
          maxWidth: "800px",
          padding: "20px"
        }}
      >
        <Button variant='contained' fullWidth onClick={handleNewStart} sx={{ marginBottom: '10px' }} >New Start</Button>
        <Button variant='contained' fullWidth disabled={user?.user_data === null} onClick={handleLoad} sx={{ marginBottom: '10px' }}>Load</Button>
        <Button variant='contained' fullWidth onClick={handleLanguage}>Language</Button>
      </Paper>
    </Container>
  )
}

export default MainPage