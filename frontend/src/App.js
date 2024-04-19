import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import RegistrationPage from './components/Reg';
import MainPage from './components/MainPage';
import LoginPage from './components/Login';
import Navigation from './components/navigation';
import ProfilePage from './components/Profile';
import MakeTest from './components/MakeTest';
import PassTest from './components/PassTest';
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
        <Route path="/pass-test/:id" element={<PassTest/>}/>
      </Routes>
    </>
  );
}

export default App;