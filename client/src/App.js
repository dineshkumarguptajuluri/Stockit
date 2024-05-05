import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
