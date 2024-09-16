import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


function StoryPage() {
  const [story, setStory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = {session: "12312"}
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
        text: story
      }
    };
    navigate("/player", {state: data})
    console.log(data)
  };

  return (
    <div className="App">
      <h1>Input</h1>
      <div>
        {Object.keys(story).map((key) => (
          <div key={key}>
            <textarea value={story[key]} onChange={(e) => setStory(e.target.value)} rows="10" cols="50" placeholder="World View" />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryPage;
