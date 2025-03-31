import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RecordsList from "../components/RecordsList";
import { supabase } from "../client";
import "./CoursePage.css";

export default function CoursePage() {
  const location = useLocation();
  const subject = new URLSearchParams(location.search).get("subject");
  const course = new URLSearchParams(location.search).get("course");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [courseInfo, setCourseInfo] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });

  const fetchGroups = async () => {
    const { data: groups, error } = await supabase.rpc("retrieve_groups", {
      subjectquery: subject,
      coursequery: course,
      p_user_id: token.user.id
    });

    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setGroups(groups);
    }
  };

  const fetchCourses = async () => {
    const { data: courseInfo, error } = await supabase.rpc("retrieve_course", {
      subjectquery: subject,
      coursequery: course,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setCourseInfo(courseInfo);
    }
  };

  const onRegister = async (record) => {
    if (record.is_registered) {
      const { data, error } = await supabase.rpc("delete_group_registration", {
        p_group_id: record.group_id,
        p_student_id: token.user.id,
      }); 

      if (error) {
        alert(error);
      } else {
        alert("Successfully deregistered!");
      }
    } else {
      const { data, error } = await supabase.rpc("insert_group_registration", {
        p_group_id: record.group_id,
        p_student_id: token.user.id,
      }); 

      if (error) {
        alert(error);
      } else {
        alert("Successfully registered!");
      }
    }

    fetchGroups();
  };

  const onDelete = async (record) => {
    const { data, error } = await supabase.rpc("delete_group", {
      p_group_id: record.group_id
    });

    if (error) {
      alert(error);
    } else {
      alert("Successfully deleted group.");
    }

    fetchGroups();
  };

  const resetFormData = () => {
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
    });
  };

  const cancelForm = () => {
    resetFormData();
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTimestamp = `${formData.date}T${formData.startTime}:00`;
    const endTimestamp = `${formData.date}T${formData.endTime}:00`;

    if (!courseInfo?.[0]?.course_id) {
      console.error("Course ID is missing");
      return;
    }

    const { data, error } = await supabase.rpc("insert_group", {
      p_course_id: courseInfo?.[0]?.course_id, 
      p_created_by: token.user.id, 
      p_description: formData.description,
      p_location: formData.location,
      p_start_time: startTimestamp,
      p_end_time: endTimestamp,
    });

    if (error) {
      console.error("Error inserting group:", error);
    } else {
      const { error: registrationError } = await supabase.rpc("insert_group_registration", {
        p_group_id: data,
        p_student_id: token.user.id,
      });
      if (registrationError) {
        console.error("Error registering user in group:", registrationError);
      } else {
        fetchGroups();
      } 
    }

    resetFormData();
    setShowModal(false);
  };

  useEffect(() => {
    if (subject && course) {
      setGroups([]);
      setCourseInfo([]);
      fetchGroups();
      fetchCourses();
      resetFormData();
    }
  }, [subject, course]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="course">
      <div className="course-header">
        <h1>
          {courseInfo?.[0]?.course_code || "Loading..."} - {courseInfo?.[0]?.course_title || ""}
        </h1>
        <h3>Subject: {courseInfo?.[0]?.subject_name || ""}</h3>
      </div>

      <div className="course-body">
        <div className="course-controls">
          <button className="add-group-button" onClick={() => setShowModal(true)}>
            ➕ Add Study Group
          </button>
        </div>
        <div>
          {groups?.length === 0 ? (
            <p>No groups found...</p>
          ) : (
            <>
              <h3>Study groups:</h3>
              <RecordsList records={groups} onRegisterToggle={onRegister} onDelete={onDelete} />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Study Group</h2>
            <form onSubmit={handleSubmit}>
              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required min={today} style={{ display: 'block', marginBottom: '10px' }} />

              <label>Start Time:</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required style={{ display: 'block', marginBottom: '10px' }} />

              <label>End Time:</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required style={{ display: 'block', marginBottom: '10px' }} />

              <label>Location:</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={{ display: 'block', marginBottom: '10px' }} />

              <label>Description:</label>
              <input type="text" name="description" value={formData.description} onChange={handleInputChange} required style={{ display: 'block', marginBottom: '25px' }} />

              <div className="modal-buttons">
                <button type="button" onClick={cancelForm}>Cancel</button>
                <button className="modal-submit" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
