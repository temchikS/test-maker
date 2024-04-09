import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import RegistrationPage from './components/Reg';
import ProfilePage from './components/Profile';
import LoginPage from './components/Login';
import Navigation from './components/navigation';

function App() {

  return (
    <>
      <Navigation/>
      <Routes>
        <Route path="/" element={<ProfilePage/>}/>
        <Route path="/registration" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  );
}

export default App;