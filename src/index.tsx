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
import DashboardTeacher from "./Pages/DashboardTeacher/DashboardTeacher";
import TeacherInfo from "./Pages/TeacherInfo/TeacherInfo";
import TeacherGroups from "./Pages/TeacherGroups/TeacherGroups";
import TeacherSchedules from "./Pages/TeacherSchedules/TeacherSchedules";
import AcademicTrafficLightApp from "./Pages/AcademicTrafficLight/AcademicTrafficLight";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboardStudent" element={<DashboardStudent />} />
        <Route path="/dashboardDean" element={<DashboardDean />} />
        <Route path="/dashboardTeacher" element={<DashboardTeacher />} />

        <Route path="/teacherInfo" element={<TeacherInfo />} />
        <Route path="/teacherGroups" element={<TeacherGroups />} />
        <Route path="/teacherSchedules" element={<TeacherSchedules />} />

        <Route path="/requestDashboard" element={<RequestDashboard />} />
        <Route path="/scheduleDisplay" element={<ScheduleDisplay />} />
        <Route path="/groupChangeRequest" element={<RequestChange />} />
        <Route path="/groupJoinRequest" element={<RequestJoin />} />
        <Route path="/groupLeaveRequest" element={<RequestLeave />} />
        <Route path="/groupLeaveRequest" element={<RequestLeave />} />
        <Route path="/academicTrafficLight" element={<AcademicTrafficLightApp />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);