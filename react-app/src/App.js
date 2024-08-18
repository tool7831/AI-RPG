import React from "react";
import StoryPage from './pages/StoryPage';
import MainPage from './pages/MainPage';
import PlayerPage from './pages/PlayerPage';
import CombatPage from './pages/CombatPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<StoryPage />} />
        <Route exact path="/main" element={<MainPage />} />
        <Route exact path="/player" element={<PlayerPage />} />
        <Route exact path="/combat" element={<CombatPage />} />
      </Routes>
    </Router>
  );
}

export default App;