import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecordsList.css";

/* Record list element for home page and course pages */
const RecordsList = ({ records, onRegisterToggle, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="records-container">
      {records.map((record, index) => (
        <div key={index} className="record-card">
          <h2 className="record-title">{record.course_code}</h2>
          <p className="record-subtitle">{record.class_date}</p>
          <p className="record-subtitle">{record.time_range}</p>
          <p className="record-class">{record.description}</p>
          <p className="record-class">{record.location}</p>
          
          {/* Register/Unregister Button */}
          <button 
            className="record-button" 
            onClick={() => onRegisterToggle(record)}
          >
            {record.is_registered ? "Unregister" : "Register"}
          </button>
          
          {/* Delete Button (Visible only if user is owner) */}
          {record.is_owner && (
            <button 
              className="record-button delete-button" 
              onClick={() => onDelete(record)}
            >
              Delete Course
            </button>
          )}
          
          {/* Group page button */}
          <button
            className="record-button details-button"
            onClick={() => navigate(`/group?groupId=${record.group_id}`)}
          >
            Group Details
          </button>
          
        </div>
      ))}
    </div>
  );
};

export default RecordsList;