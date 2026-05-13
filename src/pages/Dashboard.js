import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, isStudent, isTeacher, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/events');
      const events = eventsRes.data.events;
      
      // Calculate stats based on user role
      let userStats = {};
      
      if (isStudent()) {
        const registrationsRes = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/events/my/registrations');
        const registrations = registrationsRes.data;
        
        userStats = {
          totalEvents: events.length,
          myRegistrations: registrations.length,
          upcomingEvents: events.filter(event => new Date(event.date) > new Date()).length
        };
      } else if (isTeacher()) {
        const myEvents = events.filter(event => event.createdBy._id === user._id);
        userStats = {
          createdEvents: myEvents.length,
          totalParticipants: myEvents.reduce((sum, event) => sum + event.participants.length, 0),
          upcomingEvents: myEvents.filter(event => new Date(event.date) > new Date()).length
        };
      } else if (isAdmin()) {
        const usersRes = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/users');
        userStats = {
          totalUsers: usersRes.data.length,
          totalEvents: events.length,
          activeEvents: events.filter(event => new Date(event.date) > new Date()).length
        };
      }
      
      setStats(userStats);
      setUpcomingEvents(events.filter(event => new Date(event.date) > new Date()).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!user) {
    return (
      <div className="card">
        <h2>Please log in to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.name}! 👋</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Role: <strong>{user.role}</strong> | Department: <strong>{user.department}</strong>
      </p>

      {/* Role-specific stats */}
      <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
        {isStudent() && (
          <>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem' }}>📅</div>
              <h3>{stats.totalEvents || 0}</h3>
              <p>Total Events</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>✅</div>
              <h3>{stats.myRegistrations || 0}</h3>
              <p>My Registrations</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>🔜</div>
              <h3>{stats.upcomingEvents || 0}</h3>
              <p>Upcoming Events</p>
            </div>
          </>
        )}

        {isTeacher() && (
          <>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem' }}>📝</div>
              <h3>{stats.createdEvents || 0}</h3>
              <p>Events Created</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>👥</div>
              <h3>{stats.totalParticipants || 0}</h3>
              <p>Total Participants</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>🔜</div>
              <h3>{stats.upcomingEvents || 0}</h3>
              <p>Upcoming Events</p>
            </div>
          </>
        )}

        {isAdmin() && (
          <>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem' }}>👥</div>
              <h3>{stats.totalUsers || 0}</h3>
              <p>Total Users</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>📅</div>
              <h3>{stats.totalEvents || 0}</h3>
              <p>Total Events</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>🔜</div>
              <h3>{stats.activeEvents || 0}</h3>
              <p>Active Events</p>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
          
          {isStudent() && (
            <Link to="/my-events" className="btn btn-secondary">
              My Registrations
            </Link>
          )}
          
          {(isTeacher() || isAdmin()) && (
            <>
              <Link to="/create-event" className="btn btn-secondary">
                Create Event
              </Link>
              <Link to="/my-events" className="btn btn-secondary">
                My Events
              </Link>
            </>
          )}
          
          {isAdmin() && (
            <Link to="/admin" className="btn btn-secondary">
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
