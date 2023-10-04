// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./authState";
import { Provider } from "react-redux";
import store from "../src/store/store";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./protectedRoutes";
import UserRequestDashboard from "./components/UserRequest";
import TransactionDashboard from "./components/TransactionManagement";
import BankingDetails from "./components/BankingDetails";
import DocumentDashboard from "./components/DocumentManagement";
import LoadingScreen from "./components/LoadingScreen";
import BondsDashboard from "./components/BondsManagement";
import RegisteredUsers from "./components/RegisteredUsers";
import UserOverview from "./components/UserOverview";
import BondsRequestTable from "./components/BondRequestManagement";
import NotificationPage from "./components/Notifications";
import TermsPage from "./components/FixedTermManagement";
import IPOs from "./components/IPOs";
import TermsRequestTable from "./components/TermRequestManagement";
import IposRequestPage from "./components/IPOrequests";
import "./App.css";

function App() {
  const { loadingAuthState } = useAuth();

  return (
    <Provider store={store}>
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
                    <RegisteredUsers />
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
                path="ipos"
                element={
                  <ProtectedRoute>
                    <IPOs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ipos-requests"
                element={
                  <ProtectedRoute>
                    <IposRequestPage />
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
                path="bonds"
                element={
                  <ProtectedRoute>
                    <BondsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="bond-requests"
                element={
                  <ProtectedRoute>
                    <BondsRequestTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fixed-term-deposits"
                element={
                  <ProtectedRoute>
                    <TermsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fixed-terms-table"
                element={
                  <ProtectedRoute>
                    <TermsRequestTable />
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
              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <NotificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-overview/:userId"
                element={
                  <ProtectedRoute>
                    <UserOverview />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/" index element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" component={() => "404 Not Found"} />
          </Routes>
        </Router>
        {loadingAuthState && <LoadingScreen />}
      </div>
    </Provider>
  );
}

export default App;
