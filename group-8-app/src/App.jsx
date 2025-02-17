import React from "react";
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
  return (
    <Layout>
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
