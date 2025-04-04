import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RecordsList from "../components/RecordsList";
import { supabase } from "../client";
import "./Homepage.css";

/* Home page to display registered courses for logged in user */
export default function Homepage({token, setToken}) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const accessId = new URLSearchParams(location.search).get("accessId");

  {/* Retrieve upcoming groups that logged in user is registered for */}
  const fetchGroups = async () => {
    const { data: groups, error } = await supabase.rpc("retrieve_group_registrations", {
      p_user_id: token.user.id
    });
  
    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setGroups(groups);
    }
  };

  { /* Deregistration of selected group */ }
  const onRegister = async (record) => {
    console.log(record.group_id)
    const { data, error } = await supabase.rpc("delete_group_registration", {
      p_group_id: record.group_id,
      p_student_id: token.user.id,
    }); 

    if (error) {
      alert(error);
    } else {
      alert("Successfully deregistered!");
    }

    fetchGroups();
  };

  { /* Deletion of selected group */ }
  const onDelete = async (record) => {
    const { data, error } = await supabase.rpc("delete_group", {
      p_group_id: record.group_id,
    });

    if (error) {
      alert(error);
    } else {
      alert("Successfully deleted group.");
    }

    fetchGroups();
  };

  { /* Check if authenticated user matches search parameter and subsequently fetch groups */ }
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
            <RecordsList records={groups} onRegisterToggle={onRegister} onDelete={onDelete} />
          </>
        )
        }
      </div>
    </div>
  );
}