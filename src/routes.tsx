import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import { PrivateRoute } from "./privateRoute";
import Dashboard from "./pages/admin";

export default function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/login'
          element={<Login />}
        />
      </Routes>
    </Router>
  );
}
