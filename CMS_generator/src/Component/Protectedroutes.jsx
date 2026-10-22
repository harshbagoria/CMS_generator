import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.js";

export default function Protectedroutes({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
