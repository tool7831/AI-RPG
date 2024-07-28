import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './MainPage.css';

function FirstPage() {
  const [story, setStory] = useState();
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  const handleSubmit = () => {
    const data = {
      story: story,
      status: status,
    };

    fetch('http://localhost:8000/story_gen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      });
    console.log(data)
    navigate("/main", { state: data })
  };

  return (
    <div className="App">
      <h1>Input</h1>
      <div>
        <textarea value={story} onChange={(e) => setStory(e.target.value)} rows="10" cols="50" placeholder="World View" />
      </div>
      <div>
        <textarea value={status} onChange={(e) => setStatus(e.target.value)} rows="10" cols="50" placeholder="Status" />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FirstPage;
