import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import RegistrationPage from './components/Reg';
import WelcomePage from './components/Welcome';
import LoginPage from './components/Login';
import Navigation from './components/navigation';
import Profile from './components/profile';

function App() {
    return (
        <>
            <Navigation/>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/reg" element={<RegistrationPage/>}/>
                <Route path="/welcome" element={<WelcomePage/>}/>
                <Route path="/profile" element={<Profile/>}/> 
            </Routes>
        </>
    );
}

export default App;