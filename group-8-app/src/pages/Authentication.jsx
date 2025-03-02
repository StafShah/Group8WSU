import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import "./Authentication.css";

const Authentication = ({setToken}) => {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const supabase = createClient();

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f8f8";
  }, []);

  // AccessID regex pattern (Adjust as needed)
  const accessIdRegex = /^[a-zA-Z]{2}\d{4}$/; // Example: 'ab1234'

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate AccessID format
    if (!accessIdRegex.test(accessId)) {
      setError("Invalid AccessID format. Use two letters followed by four digits.");
      return;
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${accessId}@wayne.edu`, // Assuming email-based login
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setToken(data)
      navigate(`/homepage?accessId=${accessId}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Academica Login</h2>
        <p className="auth-description">
          Please enter your Wayne State <a href="#">AccessID</a> and password.
        </p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <label htmlFor="accessId">Your Wayne State AccessID</label>
          <input
            type="text"
            id="accessId"
            value={accessId}
            onChange={(e) => setAccessId(e.target.value)}
            required
          />
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
