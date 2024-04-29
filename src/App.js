import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route,useLocation } from "react-router-dom";
import RegistrationPage from './components/Reg';
import MainPage from './components/MainPage';
import LoginPage from './components/Login';
import Navigation from './components/navigation';
import ProfilePage from './components/Profile';
import MakeTest from './components/MakeTest';
import PassTest from './components/PassTest';
import AllTest from './components/AllTest';
import { UserProvider } from './contexts/userContext';
import NotVerTest from './components/NotVerifyedTests';
import CheckTest from './components/CheckTest';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
function App() {

  return (
    <>
      <UserProvider>
        <Navigation/>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/registration" element={<RegistrationPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/maketest" element={<MakeTest/>}/>
          <Route path="/all-tests" element={<AllTest/>}/>
          <Route path="/all-tests/:searchQuery" element={<AllTest />} />
          <Route path="/pass-test/:name/:id" element={<PassTest/>}/>
          <Route path="/not-verified-tests" element={<NotVerTest/>}/>
          <Route path="/check-test/:name/:id" element={<CheckTest/>}/>
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;