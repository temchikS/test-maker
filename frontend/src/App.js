import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import RegistrationPage from './components/Reg';
import MainPage from './components/MainPage';
import LoginPage from './components/Login';
import Navigation from './components/navigation';
import ProfilePage from './components/Profile';
import MakeTest from './components/MakeTest';
function App() {

  return (
    <>
      <Navigation/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/registration" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/maketest" element={<MakeTest/>}/>
      </Routes>
    </>
  );
}

export default App;