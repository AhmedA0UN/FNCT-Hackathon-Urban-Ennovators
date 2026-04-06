import { createBrowserRouter } from "react-router";
import SupervisorLayout from "./components/supervisor/SupervisorLayout";
import Dashboard from "./components/supervisor/Dashboard";
import BinsManagement from "./components/supervisor/BinsManagement";
import Analytics from "./components/supervisor/Analytics";
import DriverHome from "./components/driver/DriverHome";
import DriverNavigation from "./components/driver/DriverNavigation";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SupervisorLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "bins", Component: BinsManagement },
      { path: "analytics", Component: Analytics },
    ],
  },
  {
    path: "/driver",
    children: [
      { index: true, Component: DriverHome },
      { path: "navigation", Component: DriverNavigation },
    ],
  },
]);
