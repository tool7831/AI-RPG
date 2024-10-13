import React from "react";
import MainPage from "./pages/MainPage";
import PreSettingPage from './pages/PreSettingPage';
import StoryPage from './pages/StoryPage';
import PlayerPage from './pages/PlayerPage';
import CombatPage from './pages/CombatPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from "./components/navBar";
import SignIn from "./components/sign-in/SignIn.js";
import SignUp from "./components/sign-up/SignUp.js"
function App() {
  return (
    <div>
      <Router>
        <ResponsiveAppBar/>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/sign-up" element={<SignUp/>} />
          <Route exact path="/home" element={<MainPage />} />
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