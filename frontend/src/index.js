import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Dashboard, AboutUs, Landing } from "modules/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameComponent } from "modules/InGameExperience";
import GameOver from "modules/InGameExperience/GameOver";
import {
  TeamManagement,
  TeamInvitation,
  TeamDetails,
} from "modules/TeamManagement";
import {
  Login,
  Registration,
  Questionnaire,
  VerifyQuestion,
} from "modules/UserAuthentication";
import {
  CreateGame,
  GamePlayData,
} from "modules/TriviaContentManagement"
import { Header } from "components";
import ChatBot from "modules/ChatBot";
import { Games, Game } from "modules/GameLobby";
import UserProfile from "modules/UserProfile/UserProfile";
import ProfilePage from "modules/UserProfileEdit";
import { SnackbarProvider } from "notistack";
import Leaderboard from "modules/Leaderboard";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId" element={<Game />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/questions" element={<Questionnaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/user/:id/edit" element={<ProfilePage />} />
          <Route path="/validate" element={<VerifyQuestion />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/teaminviataion/:teamId" element={<TeamInvitation />} />
          <Route path="/teamdetails/:teamId" element={<TeamDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ingame" element={<GameComponent />} />
          <Route path="/gameover" element={<GameOver />} />
          <Route path="/createGame" element={<CreateGame />} />
          <Route path="/gameplaydata" element={<GamePlayData />} />
        </Routes>
        <ChatBot />
      </SnackbarProvider>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </>
);
