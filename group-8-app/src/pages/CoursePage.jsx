import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import RecordsList from "../components/RecordsList";
import { supabase } from "../client";
import "./CoursePage.css"; 

export default function CoursePage() {
  const location = useLocation();
  const subject = new URLSearchParams(location.search).get("subject");
  const course = new URLSearchParams(location.search).get("course");
  const [courseInfo, setCourseInfo] = useState([]);
  const [groups, setGroups] = useState([]);

  const handleAddGroup = () => {
    alert("Add Group button clicked! (You can wire this to a form/modal)");
  };

  const fetchGroups = async () => {
    const { data: groups, error } = await supabase.rpc("retrieve_groups", {
      subjectquery: subject,
      coursequery: course
    });
  
    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      console.log(groups);
      setGroups(groups);
    }
  };

  const fetchCourses = async () => {
    const { data: courseInfo, error } = await supabase.rpc("retrieve_course", {
      subjectquery: subject,
      coursequery: course
    });
  
    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      console.log(courseInfo);
      setCourseInfo(courseInfo);
    }
  };

  useEffect(() => {
    if (subject && course) {
      setGroups([]);
      setCourseInfo([]);
      fetchGroups();
      fetchCourses();
    }
  }, [subject, course]);

  return (
    <div className="course">
      <div className="course-header">
        <h1>{courseInfo?.[0]?.course_code || "Loading..."} - {courseInfo?.[0]?.course_title || ""}</h1>
        <h3>Subject: {courseInfo?.[0]?.subject_name || ""}</h3>
      </div>

      <div className="course-body">
        <div className="course-controls">
          <button className="add-group-button" onClick={handleAddGroup}>
            ➕ Add Study Group
          </button>
        </div>
        <div>
          {groups?.length === 0 ? (
            <p>No groups found...</p>
          ) : (
            <>
              <h3>Study groups:</h3>
              <RecordsList records={groups} />
            </>
          )
          }
        </div>
      </div>
    </div>
  );
}