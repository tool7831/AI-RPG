import React from "react";
import StoryPage from './pages/StoryPage';
import MainPage from './pages/MainPage';
import PlayerPage from './pages/PlayerPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<StoryPage />} />
        <Route exact path="/main" element={<MainPage />} />
        <Route exact path="/player" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;