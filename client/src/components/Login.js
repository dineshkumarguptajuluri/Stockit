import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';  // Make sure to create and link a CSS file for custom styles
import { useUser } from './UserContext';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const {login}=useUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { username, password };

    try {
      const response = await axios.post('http://localhost:4000/login', formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        login();
        navigate("/home");  // Assuming '/home' is the dashboard or main area
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('Error logging in. Please try again.');
      console.error("Error during login in React", error);
    }
  };

  return (
    <div className="login-container">
      {[1, 2, 3, 4, 5].map(n => <div key={n} className="background-circle"></div>)}  {/* Background animation elements */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Stockit</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && <div className="alert">{errorMessage}</div>}
        <button type="submit" className="btn-login">Login</button>
        <p className="signup-link">
          <Link to="/signup">Don't have an account? Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;