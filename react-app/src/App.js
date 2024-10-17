import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar from "./components/navBar";
import SignIn from "./components/sign-in/SignIn.js";
import SignUp from "./components/sign-up/SignUp.js";
import GamePage from "./pages/GamePage.js";
function App() {
  return (
    <div>
      <Router basename="/AI-RPG">
        <ResponsiveAppBar/>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/sign-up" element={<SignUp/>} />
          <Route exact path="/home" element={<MainPage />} />
          <Route exact path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;