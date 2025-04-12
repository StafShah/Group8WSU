import React from "react";
import "./GroupPage.css";

export default function GroupPage() {
  return (
    <div className="group-page">
      <div className="group-left">
        <label htmlFor="participants">Participants:</label>
        <select id="participants" className="dropdown">
          <option>John Doe</option>
          <option>Jane Smith</option>
          <option>Alan Turing</option>
        </select>
      </div>

      <div className="group-right">
        <h2>Discussion</h2>
        <p className="discussion-subtitle">Notes on discussion topics, reminders, etc.</p>
        <div className="discussion-thread">
          <p>[Thread messages go here...]</p>
        </div>
      </div>
    </div>
  );
}
