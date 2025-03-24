import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Taskbar.css";
import logo from "../images/logo-main.png";
import { supabase } from "../client";

const selectStyle = {
  control: (base) => ({
    ...base,
    backgroundColor: "white",
    color: "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: "black",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
  }),
  option: (base, state) => ({
    ...base,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected ? "#3b82f6" : "white",
    ":hover": {
      backgroundColor: "#e2e8f0",
    },
  }),
};  

const Taskbar = () => {
  const [subject1, setSubject1] = useState([]); // Subject dropdown options
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [options2, setOptions2] = useState([]); // Course dropdown options
  const [loadingCourses, setLoadingCourses] = useState(false); // Loading state for courses

  useEffect(() => {
    const fetchSubjects = async () => {
      let { data: subjects, error } = await supabase.rpc("retrieve_subjects");
      if (error) {
        console.error("Error fetching subjects:", error);
      } else {
        const formattedSubjects = subjects.map((s) => ({
          label: s.subject, 
          value: s.subject,
        }));
        setSubject1(formattedSubjects);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject){
      setOptions2([]);
      setSelectedCourse(null);
      return;
    }  

    const fetchCourses = async () => {
      setOptions2([]);
      setSelectedCourse(null);
      setLoadingCourses(true);
      let { data: courses, error } = await supabase.rpc("retrieve_courses", {
        subject_filter: selectedSubject.value,
      });

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        const formattedCourses = courses.map((c) => ({
          label: c.course_number, 
          value: c.course_number,
        }));
        setOptions2(formattedCourses);
      }
      setLoadingCourses(false);
    };

    fetchCourses();
  }, [selectedSubject]);

  return (
    <div className="taskbar">
      {/* Logo */}
      <img src={logo} alt="Logo" className="taskbar-logo" />

      {/* Title Banner */}
      <h2 className="title">WSU Study Groups</h2>

      {/* Searchable Select Boxes */}
      <div className="taskbar-right">
        {/* Subject Select */}
        <Select
          options={subject1}
          placeholder="Select Subject"
          styles={selectStyle}
          className="taskbar-select"
          onChange={setSelectedSubject}
        />

        {/* Course Select (Disabled until subject is selected & data is fetched) */}
        <Select
          options={options2}
          placeholder="Select Course"
          styles={selectStyle}
          className="taskbar-select"
          isDisabled={!selectedSubject || loadingCourses}
          onChange={setSelectedCourse}
          value={null ? setLoadingCourses : selectedCourse}
        />

        {/* Search Button */}
        <button className="taskbar-button">Search</button>
      </div>
    </div>
  );
};

export default Taskbar;
