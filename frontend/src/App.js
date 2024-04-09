import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import RegistrationPage from './components/Reg';
import MainPage from './components/MainPage';
import LoginPage from './components/Login';
import Navigation from './components/navigation';

function App() {

  return (
    <>
      <Navigation/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/registration" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  );
}

export default App;
