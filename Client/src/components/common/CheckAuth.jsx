import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} />;
  }

  if (isAuthenticated && location.pathname.includes('/admin') && user?.role !== "admin") {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && location.pathname.includes('/shop') && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
