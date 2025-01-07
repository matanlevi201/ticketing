import { Outlet, Navigate } from "react-router-dom";
import { useCurrentUser } from "../stores/state-ctx";

const RouteGuard = () => {
  const currentUser = useCurrentUser();

  return currentUser ? <Outlet /> : <Navigate to="/" />;
};
export default RouteGuard;
