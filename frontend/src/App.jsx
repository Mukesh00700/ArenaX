// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
// import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profile />} />       {/* Default landing page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/completeProfile" element={<CompleteProfile />} />
        {/* <Route path="*" element={<NotFound />} />   Catch-all route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
