import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage/Login";
import RequestDashboard from "./Pages/RequestDashboard/RequestDashboard";
import ScheduleDisplay from "./Pages/Schedule/ScheduleDisplay";
import RequestChange from "./Pages/RequestPages/RequestChange/RequestChange";
import RequestJoin from "./Pages/RequestPages/RequestJoin/RequestJoin";
import RequestLeave from "./Pages/RequestPages/RequestLeave/RequestLeave";
import DashboardStudent from "./Pages/DashboardStudent/DashboardStudent";
import DashboardDean from "./Pages/DashboardDean/DashboardDean";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboardStudent" element={<DashboardStudent />} />
        <Route path="/dashboardDean" element={<DashboardDean />} />


        <Route path="/requestDashboard" element={<RequestDashboard />} />
        <Route path="/scheduleDisplay" element={<ScheduleDisplay />} />
        <Route path="/groupChangeRequest" element={<RequestChange />} />
        <Route path="/groupJoinRequest" element={<RequestJoin />} />
        <Route path="/groupLeaveRequest" element={<RequestLeave />} />
        <Route path="/groupLeaveRequest" element={<RequestLeave />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);