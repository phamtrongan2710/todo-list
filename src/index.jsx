import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from "./App";
import TaskDetail from "./components/List/Task/TaskDetail.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import "./styles.css";

const router = createBrowserRouter([
  { path: "/", element: <App />, },
  { path: "/:id", element: <TaskDetail />, },
  { path: "*", element: <NotFound />, },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);