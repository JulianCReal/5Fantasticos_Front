import EnrollStudent from "./Pages/Admin/Group/EnrollStudent";
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
import DashboardAdmin from "./Pages/DashboardAdmin/DashboardAdmin";
import Students from "./Pages/Admin/Students/Students";
import RegisterStudent from "./Pages/Admin/Students/Register/RegisterStudent";
import SearchStudent from "./Pages/Admin/Students/Search/SearchStudent";
import DeleteStudent from "./Pages/Admin/Students/Delete/DeleteStudent";
import UpdateStudent from "./Pages/Admin/Students/Update/UpdateStudent";
import ListStudent from "./Pages/Admin/Students/List/ListStudent";
import Dean from "./Pages/Admin/Dean/Dean";
import RegisterDean from "./Pages/Admin/Dean/Register/RegisterDean";
import SearchDean from "./Pages/Admin/Dean/Search/SearchDean";
import DeleteDean from "./Pages/Admin/Dean/Delete/DeleteDean";
import UpdateDean from "./Pages/Admin/Dean/Update/UpdateDean";
import ListDean from "./Pages/Admin/Dean/List/ListDean";
import Teacher from "./Pages/Admin/Teacher/Teacher";
import RegisterTeacher from "./Pages/Admin/Teacher/Register/RegisterTeacher";
import SearchTeacher from "./Pages/Admin/Teacher/Search/SearchTeacher";
import DeleteTeacher from "./Pages/Admin/Teacher/Delete/DeleteTeacher";
import UpdateTeacher from "./Pages/Admin/Teacher/Update/UpdateTeacher";
import ListTeacher from "./Pages/Admin/Teacher/List/ListTeacher";
import Subject from "./Pages/Admin/Subject/Subject";
import ListGroups from "./Pages/Admin/Subject/ListGroups/ListGroups";
import RegisterSubject from "./Pages/Admin/Subject/Register/RegisterSubject";
import UpdateSubject from "./Pages/Admin/Subject/Update/UpdateSubject";
import DeleteSubject from "./Pages/Admin/Subject/Delete/DeleteSubject";
import SearchSubject from "./Pages/Admin/Subject/Search/SearchSubject";
import ListSubject from "./Pages/Admin/Subject/List/ListSubject";
import Group from "./Pages/Admin/Group/Group";
import RegisterGroup from "./Pages/Admin/Group/Register/RegisterGroup";
import UpdateGroup from "./Pages/Admin/Group/Update/UpdateGroup";
import DeleteGroup from "./Pages/Admin/Group/Delete/DeleteGroup";
import SearchGroup from "./Pages/Admin/Group/Search/SearchGroup";
import ListGroup from "./Pages/Admin/Group/List/ListGroup";

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
        <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/students/register" element={<RegisterStudent />} />
        <Route path="/admin/students/search" element={<SearchStudent />} />
        <Route path="/admin/students/delete" element={<DeleteStudent />} />
        <Route path="/admin/students/update" element={<UpdateStudent />} />
        <Route path="/admin/students/list" element={<ListStudent />} />
        <Route path="/admin/dean" element={<Dean />} />
        <Route path="/admin/dean/register" element={<RegisterDean />} />
        <Route path="/admin/dean/search" element={<SearchDean />} />
        <Route path="/admin/dean/delete" element={<DeleteDean />} />
        <Route path="/admin/dean/update" element={<UpdateDean />} />
        <Route path="/admin/dean/list" element={<ListDean />} />
        <Route path="/admin/teacher" element={<Teacher />} />
        <Route path="/admin/teacher/register" element={<RegisterTeacher />} />
        <Route path="/admin/teacher/search" element={<SearchTeacher />} />
        <Route path="/admin/teacher/delete" element={<DeleteTeacher />} />
        <Route path="/admin/teacher/update" element={<UpdateTeacher />} />
        <Route path="/admin/teacher/list" element={<ListTeacher />} />
        <Route path="/admin/subject" element={<Subject />} />
        <Route path="/admin/subject/listGroups" element={<ListGroups />} />
        <Route path="/admin/subject/register" element={<RegisterSubject />} />
        <Route path="/admin/subject/update" element={<UpdateSubject />} />
        <Route path="/admin/subject/delete" element={<DeleteSubject />} />
        <Route path="/admin/subject/search" element={<SearchSubject />} />
        <Route path="/admin/subject/list" element={<ListSubject />} />
        <Route path="/admin/group" element={<Group />} />
        <Route path="/admin/group/register" element={<RegisterGroup />} />
        <Route path="/admin/group/update" element={<UpdateGroup />} />
        <Route path="/admin/group/delete" element={<DeleteGroup />} />
        <Route path="/admin/group/search" element={<SearchGroup />} />
        <Route path="/admin/group/list" element={<ListGroup />} />
        <Route path="/admin/group/enroll" element={<EnrollStudent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
