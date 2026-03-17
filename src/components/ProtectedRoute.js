import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    const location = useLocation();

    if (!token) {

        let page = location.pathname.replace("/", "");

        return (
            <Navigate
                to={`/login?redirect=${page}`}
            />
        );
    }

    return children;
}

export default ProtectedRoute;