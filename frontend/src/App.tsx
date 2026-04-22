import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectsList from './pages/ProjectsList';
import ProjectEditor from './pages/ProjectEditor';
import ComponentLibrary from './pages/ComponentLibrary';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/projects" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/projects" /> : <Signup />}
        />
        <Route
          path="/projects"
          element={isAuthenticated ? <ProjectsList /> : <Navigate to="/login" />}
        />
        <Route
          path="/editor/:projectId"
          element={isAuthenticated ? <ProjectEditor /> : <Navigate to="/login" />}
        />
        <Route
          path="/components"
          element={isAuthenticated ? <ComponentLibrary /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/projects" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
