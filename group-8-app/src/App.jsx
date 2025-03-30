import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Homepage from "./pages/Homepage";
import CoursePage from "./pages/CoursePage";
import Taskbar from "./components/Taskbar";

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/auth" && <Taskbar />}
      {children}
    </>
  );
};

function App() {
  const [token, setToken] = useState(false);

  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

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
      </Routes>
    </Layout>
  );
}

export default App;
