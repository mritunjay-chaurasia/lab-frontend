import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import Users from './pages/Users.jsx';
import Agents from './pages/Agents.jsx';
import Conversations from './pages/Conversations.jsx';
import Logs from './pages/Logs.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import './styles/ui.css';

function Nav() {
  const { session, signOut } = useAuth();
  return (
    <nav className="navbar">
      <div className="brand">ElevenLabs Admin</div>
      <div className="nav-items">
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/">Users</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/agents">Agents</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/conversations">Conversations</NavLink>
        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/logs">Activity Logs</NavLink>
      </div>
      <div className="nav-right">
        {session ? (
          <>
            <span className="badge">{session.user?.email}</span>
            <button type="button" className="btn btn-ghost" onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/login">Login</NavLink>
            <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <Agents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conversations"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}



