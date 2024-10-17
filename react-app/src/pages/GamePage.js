import React, { useState, useEffect } from 'react';
import { fetchWithAuth, loadData } from '../components/api';

import PreSettingPage from './PreSettingPage';
import PlayerPage from './PlayerPage';
import StoryPage from './StoryPage';
import CombatPage from './CombatPage';

import { parse } from 'best-effort-json-parser'

function GamePage() {

  const [page, setPage] = useState(0);
  const [data, setData] = useState();
  const [worldView, setWorldView] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // New start
    const isFirstStart = localStorage.getItem('isFirstStart');
    if (isFirstStart === 'true') {
      setPage(1);
    }
    else {
      loadData()
        .then(response => response.json())
        .then(data => {
          setData(data);
          if (Object.keys(data?.content).includes('combat')) {
            setPage(4);
          } 
          else if (Object.keys(data?.content).includes('story')) {
            setPage(3);
          }
          else {
            alert('error');
          }
        });
    }
  }, []);

  const handleStreamSubmit = async (url, options = {}) => {
    setIsLoading(true)
    localStorage.setItem('isFirstStart', 'false');
    try {
      const response = await fetchWithAuth(url, options);

      if (response.ok) {
        const reader = response.body.getReader();  // 스트림 리더 생성
        const decoder = new TextDecoder();         // 텍스트 디코더 생성
    
        let done = false;
        let accumulatedData = '';  // 받은 데이터를 누적 저장할 변수
    
        while (!done) {
          const { value, done: readerDone } = await reader.read();  // 스트림 청크 읽기
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });  // 청크를 텍스트로 디코딩
            accumulatedData += chunk;  // 청크를 누적
            // console.log('Received chunk:', chunk);  // 받은 청크 출력
            const json_data = parse(accumulatedData)
            setData(json_data);

            if (Object.keys(json_data).includes('content') && typeof json_data.content === 'object' && json_data.content !== null) {
              if (Object.keys(json_data.content).includes('combat')) {
                setPage(4);
                setIsLoading(false);
              }
              else if (Object.keys(json_data.content).includes('story')){
                setPage(3);
                setIsLoading(false);
              }
            }
          }
        }

        // console.log('Final accumulated data:', accumulatedData);  // 최종 누적 데이터 출력
      } 

    } catch (error) {
      alert(error);
    }
    setIsLoading(false)
  }

  const handleWorldView = (worldView) => {
    setWorldView(worldView);
    setPage(2);
  }

  if(isLoading)
    return <p>Loading...</p>

  return (
    <div style={{padding:'10px'}}>
      {page === 1 && <PreSettingPage handleData={handleWorldView} />}
      {page === 2 && <PlayerPage worldView={worldView} handleFetch={handleStreamSubmit} />}
      {page === 3 && <StoryPage data={data} handleFetch={handleStreamSubmit} />}
      {page === 4 && <CombatPage data={data} handleFetch={handleStreamSubmit} />}
    </div>
  )
}

export default GamePage;