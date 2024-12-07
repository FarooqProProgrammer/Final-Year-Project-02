import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

const App = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
      <SidebarTrigger />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </main>
    </SidebarProvider>
  )
}

export default App
