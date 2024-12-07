import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import DashboardProvider from "./components/Provider/DashboardProvider"

const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardProvider />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
