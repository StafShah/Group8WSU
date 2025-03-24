import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Homepage.css"
import RecordsList from "../components/RecordsList";
import { supabase } from "../client";

export default function Homepage({token, setToken}) {
  // const records = [
  //   { title: "Math 101", timeRange: "8:00 AM - 9:30 AM", className: "Room A" },
  //   { title: "History 202", timeRange: "10:00 AM - 11:30 AM", className: "Room B" },
  //   { title: "Physics 303", timeRange: "1:00 PM - 2:30 PM", className: "Room C" }
  // ];
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const accessId = new URLSearchParams(location.search).get("accessId");

  const fetchGroups = async () => {
    const { data: groups, error } = await supabase.rpc("retrieve_group_registrations", {
      p_user_id: token.user.id
    });
  
    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      console.log("Groups data:", groups);
      setGroups(groups);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const userAccessId = token.user.email

      if (!token || !token.user || userAccessId.slice(0, 6) !== accessId) {
        alert("Authentication mismatch, please login again!");
        sessionStorage.removeItem('token');
        setToken(false);
        navigate("/auth"); 
        return;  
      }
    };

    checkAuth();
    fetchGroups();
  }, [navigate, accessId]);

  return (
    <div>
      <div className="homepage-1">
        <h1 className="greeting">Welcome, {token.user.user_metadata.first_name}!</h1>
      </div>
      <div className="homepage-2">
        {groups?.length === 0 ? (
          <p>No groups found...</p>
        ) : (
          <>
            <h3>Your study groups:</h3>
            <RecordsList records={groups} />
          </>
        )
        }
      </div>
    </div>
  );
}