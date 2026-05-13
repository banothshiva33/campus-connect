import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isStudent, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '0.5rem 0'
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #fff, #e0e7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    listStyle: 'none',
    alignItems: 'center',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const primaryButtonStyle = {
    ...linkStyle,
    background: 'linear-gradient(45deg, #f59e0b, #d97706)',
    border: 'none',
    boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)'
  };

  const profileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'white',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.15)',
    fontSize: '0.9rem'
  };

  const logoutButtonStyle = {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease'
  };

  return (
    <header className="header" style={headerStyle}>
      <nav className="nav" style={navStyle}>
        <Link to="/" className="logo" style={logoStyle}>
          <span style={{ fontSize: '2rem' }}>🎓</span>
          CampusConnect
        </Link>
        
        <ul className="nav-links" style={navLinksStyle}>
          <li>
            <Link to="/" style={linkStyle}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" style={linkStyle}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/calendar" style={linkStyle}>
              Calendar
            </Link>
          </li>
          
          {user ? (
            <>
              {/* Teacher Features */}
              {isTeacher() && (
                <li>
                  <Link to="/create-event" style={primaryButtonStyle}>
                    ➕ Create Event
                  </Link>
                </li>
              )}
              
              {/* Admin Features */}
              {isAdmin() && (
                <>
                  <li>
                    <Link to="/admin" style={linkStyle}>
                       Admin
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-event" style={primaryButtonStyle}>
                      ➕ Create Event
                    </Link>
                  </li>
                </>
              )}

              {/* Profile */}
              <li>
                <Link to="/profile" style={profileStyle}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>Profile</span>
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button 
                  onClick={handleLogout}
                  style={logoutButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                   Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" style={linkStyle}>
                   Login
                </Link>
              </li>
              <li>
                <Link to="/register" style={{
                  ...linkStyle,
                  color: '#667eea',
                  background: 'white',
                  border: 'none'
                }}>
                   Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;