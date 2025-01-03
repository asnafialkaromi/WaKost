import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import KostPage from "./pages/KostPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Properties from "./pages/Properties.jsx";
import AddProperties from "./pages/AddProperties.jsx";
import DetailProperties from "./pages/DetailProperties.jsx";
import EditProperties from "./pages/EditProperties.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/kost",
    element: <KostPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/properties/add",
    element: <AddProperties />,
  },
  {
    path: "/kost/:id",
    element: <DetailProperties />,
  },
  {
    path: "/properties/edit/:id",
    element: <EditProperties />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
