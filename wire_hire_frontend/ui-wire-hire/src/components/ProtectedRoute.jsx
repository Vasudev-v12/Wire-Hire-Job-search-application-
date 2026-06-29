import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { token, role: userRole } = useAuth(); 
    console.log("Protected Route Check - Current Token:", token);
    console.log("Protected Route Check - Expected Role:", role, " | User Role:", userRole);
    
    if (!token) {
        return <Navigate to="/user/login" replace />;
    }

    if (role && userRole?.toLowerCase() !== role?.toLowerCase()) {
        console.warn(`Access Denied! ${userRole} does not match required role: ${role}`);
        return <Navigate to="/" replace />;
    }

    return children;
}
