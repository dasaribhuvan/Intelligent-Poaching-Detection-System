import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AlertPage from "./pages/AlertPage";
import UploadPage from "./pages/UploadPage";

import DashboardLayout from "./components/Dashboard/DashboardLayout";

import { Toaster } from "react-hot-toast";


function App() {

  const isAuthenticated = !!localStorage.getItem("token");

  return (

    <Router>

      {/* Toast Notifications */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#071410",
            color: "#22c55e",
            border: "1px solid #14532d",
            borderRadius: "12px",
          },
        }}
      />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />



        {/* Protected Dashboard */}

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        {/* Upload Detection */}

        <Route
          path="/upload"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <UploadPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        {/* Alerts */}

        <Route
          path="/alerts"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <AlertPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        {/* Catch All */}

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>

  );

}

export default App;