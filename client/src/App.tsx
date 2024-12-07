import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardProvider from "./components/Provider/DashboardProvider";
import { Toaster } from "./components/ui/toaster";
import Project from "./pages/dashboard/project";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import CreateProject from "./pages/dashboard/project/create-project";

const queryClient = new QueryClient();

const App = () => {
  // Check if the user is authenticated by checking the token in cookies
  const authToken = Cookies.get('authToken');

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardProvider />}>
            {/* Protecting the dashboard and project routes */}
            <Route
              path="/dashboard"
              element={authToken ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/project"
              element={authToken ? <Project /> : <Navigate to="/login" />}
            />

            <Route path="/project/create-project" element={<CreateProject />} />
          </Route>

          {/* If user is logged in, do not allow them to access the login page */}
          <Route
            path="/login"
            element={authToken ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
