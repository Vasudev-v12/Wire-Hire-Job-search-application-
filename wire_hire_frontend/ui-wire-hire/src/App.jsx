import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import UserRegister from "./pages/UserRegister";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyResigter";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}