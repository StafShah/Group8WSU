import React from "react";
import "./RecordsList.css"; // Import styles

const RecordsList = ({ records }) => {
  return (
    <div className="records-container">
      {records.map((record, index) => (
        <div key={index} className="record-card">
          <h2 className="record-title">{record.course_code}</h2>
          <p className="record-subtitle">{record.class_date}</p>
          <p className="record-subtitle">{record.time_range}</p>
          <p className="record-class">{record.description}</p>
          <p className="record-class">{record.location}</p>
        </div>
      ))}
    </div> 
  );
};

export default RecordsList;
