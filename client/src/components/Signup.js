import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = (event) => {
    event.preventDefault();


   async function checkdata(){
      const formdata={username,password};
      
      try{
        const response=await axios.post('http://localhost:4000/signup',formdata);
        if (response.data.success) { // Assuming response has a success property
          // Handle successful login
         navigate("/")
          // Redirect to home page or perform other actions based on successful login
        } else {
          setErrorMessage('Invalid username or password'); // Set error message
        }
      
      }
      catch(error){
        console.log("error during login in react");
      }
     }
     checkdata();
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        />
      </div>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <button type="submit" className="btn btn-primary">
        Signup
      </button>
      <Link to="/">Already have a account</Link>
    </form>
  );
}

export default Signup;
