import React,{ useState, useEffect } from "react";
import "./GroupPage.css";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

export default function GroupPage() {
  const groupId = new URLSearchParams(location.search).get("groupId");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const [groupInfo, setGroupInfo] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const navigate = useNavigate();

  const fetchGroupInformation = async () => {
    const { data: groups, error } = await supabase.rpc("retrieve_group_information", {
      p_user_id: token.user.id,
      p_group_id: groupId
    });

    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setGroupInfo(groups);
    }
  }

  const fetchParticipants = async () => {
    const { data: participants, error } = await supabase.rpc("retrieve_group_participants", {
      p_group_id: groupId
    });

    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setParticipants(participants);
    }
  }

  const fetchMessages = async () => {
    const { data: messages, error } = await supabase.rpc("retrieve_group_messages", {
      p_group_id: groupId
    });

    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      setMessages(messages);
    }
  }

  const onRegister = async () => {
    if (groupInfo?.[0]?.is_registered) {
      const { data, error } = await supabase.rpc("delete_group_registration", {
        p_group_id: groupId,
        p_student_id: token.user.id,
      }); 

      if (error) {
        alert(error);
      } else {
        alert("Successfully deregistered!");
      }
    } else {
      const { data, error } = await supabase.rpc("insert_group_registration", {
        p_group_id: groupId,
        p_student_id: token.user.id,
      }); 

      if (error) {
        alert(error);
      } else {
        alert("Successfully registered!");
      }
    }

    fetchGroupInformation();
    fetchParticipants();
  };

  const onDelete = async () => {
    const { error } = await supabase.rpc("delete_group", {
      p_group_id: groupId
    });

    if (error) {
      alert(error);
    } else {
      alert("Successfully deleted group.");
    }

    handleBackToCourse();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.rpc("insert_group_message", {
      p_group_id: groupId,
      p_author_id: token.user.id,
      p_message: newMessage,
      p_parent_id: replyTo
    });

    if (error) {
      alert(error);
    } else {
      setNewMessage("");
      setReplyTo(null);
      fetchMessages();
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const { error } = await supabase.rpc("delete_thread_message", {
      p_message_id: messageId
    });

    if (error) {
      alert(error);
    } else {
      fetchMessages();
    }
  };

  useEffect(() => {
    setGroupInfo([]);
    fetchGroupInformation();
    fetchParticipants();
    fetchMessages();
  }, []);

  const handleBackToCourse = () => {
    navigate(`/course?subject=${groupInfo?.[0]?.course_code.slice(0, 3)}&course=${groupInfo?.[0]?.course_code.slice(3)}`);
  };

  const renderMessage = (message, depth = 0) => {
    const replies = messages.filter(m => m.parent_id === message.message_id);
    const isAuthor = message.author_id === token.user.id;
    
    return (
      <div key={message.message_id} className="message-container" style={{ marginLeft: `${depth * 20}px` }}>
        <div className="message-header">
          <span className="message-author">{message.author_name}</span>
          <div className="message-actions">
            <span className="message-time">
              {new Date(message.created_at).toLocaleString()}
            </span>
            {isAuthor && (
              <button 
                className="delete-message-button"
                onClick={() => handleDeleteMessage(message.message_id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="message-content">{message.message}</div>
        <button 
          className="reply-button"
          onClick={() => setReplyTo(message.message_id)}
        >
          Reply
        </button>
        {replies.map(reply => renderMessage(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="group-main">
      {/* Class Name and Description */}
      <div className="class-header">
        <h2 className="class-name">{groupInfo?.[0]?.course_code + " " + "Group" || "Loading..."}</h2>
        <div className="class-info">
          <p>Description: {groupInfo?.[0]?.description || ""}</p>
          <p>Location: {groupInfo?.[0]?.location || ""}</p>
          <p>Time: {groupInfo?.[0]?.time_range || ""}</p>
        </div>
        <div className="class-controls">
          {/* Register/Unregister Button */}
          <button 
            className="record-button" 
            onClick={() => onRegister()}
          >
            {groupInfo?.[0]?.is_registered ? "Unregister" : "Register"}
          </button>
          
          {/* Delete Button (Visible only if user is owner) */}
          {groupInfo?.[0]?.is_owner && (
            <button 
              className="record-button delete-button" 
              onClick={() => onDelete()}
            >
              Delete Group
            </button>
          )}
          <button className="record-button details-button" onClick={handleBackToCourse}>
            Course Details
          </button>
        </div>
      </div>

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
              {participants.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.first_name + " " + participant.last_name}</td>
                  <td>{participant.access_id}</td>
                  <td>{participant.access_id + "@wayne.edu"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Discussion Section */}
        <div className="discussion-box">
          <h3>Discussion</h3>
          <div className="discussion-thread">
            {messages.map(message => 
              message.parent_id === null && renderMessage(message)
            )}
          </div>
          <div className="reply-section">
            {replyTo && (
              <div className="replying-to">
                Replying to message #{replyTo}
                <button 
                  className="cancel-reply"
                  onClick={() => setReplyTo(null)}
                >
                  ×
                </button>
              </div>
            )}
            <input
              type="text"
              className="reply-input"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="submit-button"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
