import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyEvents = () => {
  const { user, isStudent, isTeacher } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    if (isStudent()) {
      fetchMyRegistrations();
    }
    if (isTeacher()) {
      fetchCreatedEvents();
    }
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/my/registrations`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const fetchCreatedEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
      const myEvents = response.data.events.filter(event => event.createdBy._id === user._id);
      setCreatedEvents(myEvents);
    } catch (error) {
      console.error('Error fetching created events:', error);
    }
  };

  return (
    <div className="my-events">
      <h1>My Events</h1>
      
      {/* Tab Navigation */}
      {(isStudent() || isTeacher()) && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {isStudent() && (
            <button 
              className={activeTab === 'registered' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setActiveTab('registered')}
            >
              My Registrations
            </button>
          )}
          {isTeacher() && (
            <button 
              className={activeTab === 'created' ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setActiveTab('created')}
            >
              Events I Created
            </button>
          )}
        </div>
      )}

      {/* Student View - Registered Events */}
      {isStudent() && activeTab === 'registered' && (
        <div>
          <h2>My Registered Events</h2>
          {registrations.length === 0 ? (
            <div className="card">
              <p>You haven't registered for any events yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {registrations.map(registration => (
                <div key={registration._id} className="card">
                  <h3 style={{ color: '#2563eb' }}>{registration.event.title}</h3>
                  <p>{registration.event.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <span>📅 {new Date(registration.event.date).toLocaleDateString()}</span>
                    <span>📍 {registration.event.venue}</span>
                    <span>Status: {registration.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teacher View - Created Events */}
      {isTeacher() && activeTab === 'created' && (
        <div>
          <h2>Events I Created</h2>
          {createdEvents.length === 0 ? (
            <div className="card">
              <p>You haven't created any events yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {createdEvents.map(event => (
                <div key={event._id} className="card">
                  <h3 style={{ color: '#2563eb' }}>{event.title}</h3>
                  <p>{event.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.venue}</span>
                    <span>👥 {event.participants.length} participants</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
