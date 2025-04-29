import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';

import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Profile       from './pages/Profile';
import About         from './pages/About';
import Instruments   from './pages/Instruments';
import Friends       from './pages/Friends';
import Collaboration from './pages/Collaboration';

function App() {
  const isAuth = !!localStorage.getItem('token');

  return (
      <div className="App">
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <NavLink to="/" end style={{ marginRight: 8 }}>Home</NavLink>
          {!isAuth && <NavLink to="/login" style={{ marginRight: 8 }}>Login</NavLink>}
          {!isAuth && <NavLink to="/register" style={{ marginRight: 8 }}>Register</NavLink>}
          {isAuth && <NavLink to="/profile" style={{ marginRight: 8 }}>Profile</NavLink>}
          <NavLink to="/about" style={{ marginRight: 8 }}>About</NavLink>
          <NavLink to="/instruments" style={{ marginRight: 8 }}>Instruments</NavLink>
          {isAuth && <NavLink to="/friends" style={{ marginRight: 8 }}>Friends</NavLink>}
          {isAuth && <NavLink to="/collaboration">Collaboration</NavLink>}
        </nav>

        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
                path="/login"
                element={isAuth ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuth ? <Navigate to="/" replace /> : <Register />}
            />
            <Route
                path="/profile"
                element={isAuth ? <Profile /> : <Navigate to="/login" replace />}
            />

            <Route path="/about" element={<About />} />
            <Route path="/instruments" element={<Instruments />} />

            <Route
                path="/friends"
                element={isAuth ? <Friends /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/collaboration"
                element={isAuth ? <Collaboration /> : <Navigate to="/login" replace />}
            />

            {/* catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
