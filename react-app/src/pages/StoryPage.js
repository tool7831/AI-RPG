import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './StoryPage.css';


function StoryPage() {
  const [story, setStory] = useState();
  const navigate = useNavigate();

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
        <textarea value={story} onChange={(e) => setStory(e.target.value)} rows="10" cols="50" placeholder="World View" />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default StoryPage;
