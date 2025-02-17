import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css"
import RecordsList from "../components/RecordsList";
import { createClient } from "@supabase/supabase-js";

// const supabase = createClient("https://YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

export default function Homepage() {
  const records = [
    { title: "Math 101", timeRange: "8:00 AM - 9:30 AM", className: "Room A" },
    { title: "History 202", timeRange: "10:00 AM - 11:30 AM", className: "Room B" },
    { title: "Physics 303", timeRange: "1:00 PM - 2:30 PM", className: "Room C" }
  ];
  // const [userEmail, setUserEmail] = useState(null);
  // const location = useLocation();
  // const navigate = useNavigate();

  const accessId = new URLSearchParams(location.search).get("accessId");

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { data } = await supabase.auth.getUser();
  //     console.log(data);
  //     if (!data.session || !data.session.user) {
  //       navigate("/auth"); 
  //     }
  //     const userEmail = data.session.user.email; // Assuming email is used for login
  //     const userAccessId = userEmail.split("@")[0]; // Extract AccessID from email (e.g., abc123@wayne.edu → abc123)
  //     console.log(userAccessId);

  //     setUserEmail(userAccessId);

  //     if (userAccessId !== accessId) {
  //       navigate("/auth"); // Redirect if AccessID does not match
  //     }
  //   };

  //   checkAuth();
  // }, [navigate, accessId]);

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