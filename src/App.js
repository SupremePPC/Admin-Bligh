// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./protectedRoutes";
import DashboardOverview from "./components/Overview";
import UserRequestDashboard from "./components/UserRequest";
import TransactionDashboard from "./components/TransactionManagement";
import BankingDetails from "./components/BankingDetails";
import DocumentDashboard from "./components/DocumentManagement";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./authState";

function App() {
  const { loadingAuthState } = useAuth();

  return (
    <div className="App">
    <Router>
      <Routes>
        <Route
          path="/dashboard/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />
            <Route
              path="user-requests"
              element={
                <ProtectedRoute>
                  <UserRequestDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute>
                  <TransactionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="banking-details"
              element={
                <ProtectedRoute>
                  <BankingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="documents"
              element={
                <ProtectedRoute>
                  <DocumentDashboard />
                </ProtectedRoute>
              }
            />
        </Route>
        <Route path="/" index element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
    {loadingAuthState && <LoadingScreen />} 
    </div>
  );
}

export default App;
