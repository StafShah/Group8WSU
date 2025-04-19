import React from "react";
import "./GroupPage.css";

export default function GroupPage() {
  return (
    <div className="group-main">
      {/* Class Name and Description */}
      <h2 className="class-name">CLASS NAME</h2>
      <div className="class-description">This is the class description.</div>

      {/* Main Content Area */}
      <div className="content-sections">
        {/* Participants Section */}
        <div className="participants-box">
          <h3>Participants:</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Access ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>jd1234</td>
                <td>john@example.com</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>js5678</td>
                <td>jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Discussion Section */}
        <div className="discussion-box">
          <h3>Discussion</h3>
          <p>Notes on topics, reminders, etc.</p>
          <div className="discussion-thread">
            <p>[Thread messages go here...]</p>
          </div>
          <div className="reply-section">
            <input
              type="text"
              className="reply-input"
              placeholder="Write a reply..."
            />
            <button className="submit-button">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
