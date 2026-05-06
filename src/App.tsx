import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Newspaper, LogIn, LogOut, Settings } from 'lucide-react';
import { NewsProvider, useNews } from './context/NewsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const Navbar = () => {
  const { user, logout } = useNews();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Newspaper size={28} />
          <span>Daily Updates</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user.isAuthenticated ? (
            <>
              <Link to="/admin" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Settings size={18} /> Admin
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <LogIn size={18} /> Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <NewsProvider>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </Router>
    </NewsProvider>
  );
}

export default App;
