import React from "react";
import MainPage from "./pages/MainPage";
import PreSettingPage from './pages/PreSettingPage';
import StoryPage from './pages/StoryPage';
import PlayerPage from './pages/PlayerPage';
import CombatPage from './pages/CombatPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from "./components/navBar";
function App() {
  return (
    <div>
      <ResponsiveAppBar/>
      <Router>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/select" element={<PreSettingPage />} />
          <Route exact path="/story" element={<StoryPage />} />
          <Route exact path="/player" element={<PlayerPage />} />
          <Route exact path="/combat" element={<CombatPage />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;