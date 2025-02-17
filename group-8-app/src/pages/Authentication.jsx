import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./Authentication.css";

// Initialize Supabase client
const supabaseUrl = 'https://fdkyxlscsxrqjowsxoqm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Authentication = () => {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    const { user, error } = await supabase.auth.signInWithPassword({
      email: `${accessId}@wayne.edu`, // Assuming email-based login
      password,
    });

    if (error) {
      setError(error.message);
    } else {
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
