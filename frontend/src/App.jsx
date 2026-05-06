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

  // Check token from localStorage
  const token = localStorage.getItem("token");

  // Authentication status
  const isAuthenticated = token !== null;

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

        {/* ================================================= */}
        {/* PUBLIC ROUTES */}
        {/* ================================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <Signup />
          }
        />

        {/* ================================================= */}
        {/* DASHBOARD */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* UPLOAD PAGE */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* ALERTS PAGE */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* INVALID ROUTES */}
        {/* ================================================= */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </Router>

  );
}

export default App;