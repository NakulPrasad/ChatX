import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import ErrorPage from "./pages/Error.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { useCookie } from "./hooks/useCookie.js";

const PrivateRoute = ({ children, redirectTo }) => {
  const { getItem } = useCookie();
  return getItem("user") ? children : <Navigate to={redirectTo} />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute redirectTo={"/join"}>
        <App />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/join",
    element: <JoinRoom />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
