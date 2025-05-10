import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <nav className="flex justify-between items-center p-4 bg-gray-800">
            <Link to="/" className="text-2xl font-bold">Reverb</Link>
            <div className="space-x-4">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
