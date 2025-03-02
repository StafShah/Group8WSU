import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css"
import RecordsList from "../components/RecordsList";


export default function Homepage({token, setToken}) {
  const records = [
    { title: "Math 101", timeRange: "8:00 AM - 9:30 AM", className: "Room A" },
    { title: "History 202", timeRange: "10:00 AM - 11:30 AM", className: "Room B" },
    { title: "Physics 303", timeRange: "1:00 PM - 2:30 PM", className: "Room C" }
  ];
  // const [userEmail, setUserEmail] = useState(null);
  // const location = useLocation();
  const navigate = useNavigate();
  const accessId = new URLSearchParams(location.search).get("accessId");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !token.user) {
        alert("Authentication mismatch, please login again!");
        sessionStorage.removeItem('token');
        setToken(false);
        navigate("/auth"); 
        return;
      }

      console.log(token)
      const userAccessId = token.user.email
      if (userAccessId.slice(0, 6) !== accessId) {
        alert("Authentication mismatch, please login again!");
        sessionStorage.removeItem('token');
        setToken(false);
        navigate("/auth"); 
      }
    };

    checkAuth();
  }, [navigate, accessId]);

  return (
    <div>
      <div className="homepage-1">
        <h1 className="greeting">Welcome, {accessId}!</h1>
      </div>
      <div className="homepage-2">
        <h3>Your study groups:</h3>
        <RecordsList records={records} />
      </div>
    </div>
  );
}