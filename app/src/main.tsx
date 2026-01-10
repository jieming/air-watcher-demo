import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import WatchCityList from "./components/WatchCityList"

import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/watch-list' replace />,
  },
  {
    path: "/watch-list",
    element: <WatchCityList />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
