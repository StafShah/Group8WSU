import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import "./Authentication.css";

const Authentication = ({setToken}) => {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f8f8";
  }, []);

  // AccessID regex pattern
  const accessIdRegex = /^[a-zA-Z]{2}\d{4}$/; 

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

    // Catch potential errors
    if (error) {
      setError(error.message);
    } else {
      let { data: user, error } = await supabase.rpc("retrieve_student", {
        access_id_filter: accessId
      });

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        data.user.user_metadata.first_name = user[0].first_name;
        data.user.user_metadata.last_name = user[0].last_name;
      }
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
