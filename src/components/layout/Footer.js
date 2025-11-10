import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" style={{ 
      background: '#1e293b', 
      color: 'white', 
      padding: '3rem 2rem 2rem',
      marginTop: '4rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Brand Section */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎓 CampusConnect
          </h3>
          <p style={{ lineHeight: '1.6', color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Your central hub for all academic and extracurricular events. 
            Connecting students, teachers, and administrators in one platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#374151', padding: '0.5rem', borderRadius: '8px' }}>📘</div>
            <div style={{ background: '#374151', padding: '0.5rem', borderRadius: '8px' }}>📱</div>
            <div style={{ background: '#374151', padding: '0.5rem', borderRadius: '8px' }}>🐦</div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/events" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Events</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/calendar" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Calendar</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Help Center</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact Us</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Contact Info</h4>
          <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            <p>📧 support@campusconnect.edu</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>🏢 University Campus, Education City</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ 
        borderTop: '1px solid #374151', 
        paddingTop: '2rem', 
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        <p>&copy; 2024 CampusConnect. All rights reserved. | Bringing academic communities together through events.</p>
      </div>
    </footer>
  );
};

export default Footer;
