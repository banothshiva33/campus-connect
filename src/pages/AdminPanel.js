import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
      fetchStats();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const eventsRes = await axios.get('http://localhost:5000/api/events');
      const events = eventsRes.data.events;
      
      setStats({
        totalEvents: events.length,
        totalUsers: users.length,
        activeEvents: events.filter(e => new Date(e.date) > new Date()).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="card">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      {/* Statistics */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>{stats.totalEvents || 0}</h3>
          <p>Total Events</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>{stats.activeEvents || 0}</h3>
          <p>Active Events</p>
        </div>
      </div>

      {/* Users Management */}
      <div className="card">
        <h2>User Management</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>{user.name}</td>
                  <td style={{ padding: '1rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      background: user.role === 'admin' ? '#ef4444' : 
                                 user.role === 'teacher' ? '#f59e0b' : '#10b981',
                      color: 'white'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{user.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
