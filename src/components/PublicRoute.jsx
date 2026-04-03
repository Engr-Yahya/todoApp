import { Navigate } from "react-router-dom";
import useStore from "../pages/UseStore";

function PublicRoute({ children }) {
  const { userData } = useStore();
  const isLoggedIn = userData.some((user) => user.isLoggedIn);

  return !isLoggedIn ? children : <Navigate to="/home" />;
}

export default PublicRoute;