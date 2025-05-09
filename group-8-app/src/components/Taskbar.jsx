import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Taskbar.css";
import logo from "../images/logo-main.png";
import { supabase } from "../client";

/* Styling for select boxes (course and subject)*/
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

/* Taskbar element to carry over every page in application (except auth)*/
const Taskbar = () => {
  const [subject1, setSubject1] = useState([]); // Subject dropdown options
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [options2, setOptions2] = useState([]); // Course dropdown options
  const [loadingCourses, setLoadingCourses] = useState(false); // Loading state for courses
  const token = JSON.parse(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  {/* Grab subjects from backend */}
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

  {/* Grab courses from backend with subject parameter */}
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

  {/* Handle search button click to navigate to correct course page */}
  const handleSearch = (e) => {
    navigate(`/course?subject=${selectedSubject.value}&course=${selectedCourse.value}`);
    setSelectedSubject(null);
    setSelectedCourse(null);
  }

  {/* Handle logout button click */}
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/auth");
  };

  // Fetch subjects only once on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch courses when subject selection changes
  useEffect(() => {
    if (selectedSubject) {
      fetchCourses();
    } else {
      setOptions2([]);
      setSelectedCourse(null);
    }
  }, [selectedSubject]);


  return (
    <div className="taskbar">
      {/* Logo */}
      <Link to={`/homepage?accessId=${token.user.email.slice(0, 6)}`}>
        <img src={logo} alt="Logo" className="taskbar-logo" />
      </Link>

      {/* Title Banner */}
      <h2 className="title">WSU Study Groups</h2>

      {/* Searchable Select Boxes */}
      <div className="taskbar-right">
        {/* Subject Select */}
        <Select id="select-subject"
          options={subject1}
          placeholder="Select Subject"
          styles={selectStyle}
          className="taskbar-select"
          onChange={setSelectedSubject}
          value={selectedSubject}
        />

        {/* Course Select (Disabled until subject is selected & data is fetched) */}
        <Select
          options={options2}
          placeholder="Select Course"
          styles={selectStyle}
          className="taskbar-select"
          isDisabled={!selectedSubject || loadingCourses}
          onChange={setSelectedCourse}
          value={selectedCourse}
        />

        {/* Search Button */}
        <button 
        className="taskbar-button" 
        onClick={handleSearch} 
        disabled={!selectedSubject || !selectedCourse}
        >
          Search
        </button>

        {/* Logout Button */}
        <button 
          className="taskbar-button logout-button" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
