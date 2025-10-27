import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage/Login";
import Dashboard from "./Pages/DashboardStudent/DashboardStudent";
import RequestDashboard from "./Pages/RequestDashboard/RequestDashboard";
import ScheduleDisplay from "./Pages/Schedule/ScheduleDisplay";
import RequestChange from "./Pages/RequestPages/RequestChange/RequestChange";
import RequestJoin from "./Pages/RequestPages/RequestJoin/RequestJoin";
import RequestLeave from "./Pages/RequestPages/RequestLeave/RequestLeave";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requestDashboard" element={<RequestDashboard />} />
        <Route path="/scheduleDisplay" element={<ScheduleDisplay />} />
        <Route path="/groupChangeRequest" element={<RequestChange />} />
        <Route path="/groupJoinRequest" element={<RequestJoin />} />
        <Route path="/groupLeaveRequest" element={<RequestLeave />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);