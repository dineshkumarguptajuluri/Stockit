import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css'; // Reusing Login.css for Signup
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { username, password, email };

    try {
      const response = await axios.post('https://stockit-2.onrender.com/signup', formData);
      if (response.data.success) {
        toast.success("Account has been Created");
        navigate("/");  // Redirect to home or login page on successful signup
      } else {
        setErrorMessage(response.data.message || 'Signup failed! Please try again.');
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during signup", error);
      setErrorMessage('Server error during signup. Please try again.');
    }
  };

  return (
    <div className="login-container">
                  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {[1, 2, 3, 4, 5].map(n => <div key={n} className="background-circle"></div>)}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button type="submit" className="btn-login">Signup</button>
        <p className="signup-link">
          <Link to="/">Already Have a Account</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
