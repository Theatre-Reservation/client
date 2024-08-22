// import React from 'react'

// export default function SignInPage() {
//   return (
//     <div>
//         <h1>SignInPage</h1></div>
//   )
// }

import React, { useState } from 'react';
import '/src/styles/SignInPage.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Handle sign-in logic here, such as sending a request to the server
    console.log('Email:', email);
    console.log('Password:', password);
    // Reset error message
    setError('');
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p className="signup-message">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
