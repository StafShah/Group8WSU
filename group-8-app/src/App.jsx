import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Homepage from "./pages/Homepage";
import CoursePage from "./pages/CoursePage";
import GroupPage from "./pages/GroupPage";
import Taskbar from "./components/Taskbar";
import "./App.css";

// Function to add taskbar to respective pages
const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="app-container">
      {location.pathname !== "/auth" && <Taskbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(false);

  // Token storage for global scope reference
  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  // Function to asynchronously set token
  useEffect(() => {
    if(sessionStorage.getItem('token')) {
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    } 
  }, [])

  return (
    <Layout>
      <Routes>
        {token?<Route path="/homepage" element={<Homepage token={token} setToken={setToken}/>} />:""}
        <Route path="/auth" element={<Authentication setToken={setToken}/>} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/group" element={<GroupPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
