import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import {fetchWithAuth, loadData} from '../components/api';

function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/users/me');
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
    navigate('/select')
  }
  const handleLoad = () => {
    loadData()
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).includes('combat')) {
          navigate('/combat')
        } else {
          navigate('/story')
        }
      });
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <div>
        <Button onClick={handleNewStart}>New Start</Button>
        <Button disabled={user?.user_data === null} onClick={handleLoad}>Load</Button>
      </div>
    </Container>
  )
}

export default MainPage