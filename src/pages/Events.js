import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [userRegistrations, setUserRegistrations] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/my/registrations`, {
        headers: { 
          Authorization: `Bearer ${user.token}` 
        }
      });
      
      const registrationsMap = {};
      response.data.forEach(reg => {
        registrationsMap[reg.event._id] = true;
      });
      setUserRegistrations(registrationsMap);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate('/event/' + eventId);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.category === filter;
  });

  // Default event images for different categories
  const eventImages = {
    academic: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    cultural: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    workshop: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400',
    seminar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
  };

  // Get event background style
  const getEventBackground = (event) => {
    if (event.image) {
      return {
        backgroundImage: `url(${process.env.REACT_APP_API_URL}${event.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      return {
        backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(${eventImages[event.category] || eventImages.other})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      };
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: '#1e293b' }}>Discover Events</h1>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem', 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Discover Events
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Explore exciting academic, cultural, and sports events happening across campus
        </p>
      </div>

      {/* Filter Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', 
        padding: '2rem', 
        borderRadius: '15px',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ color: '#1e293b', margin: 0 }}>Filter by Category</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'academic', 'sports', 'cultural', 'workshop', 'seminar', 'other'].map(category => (
              <button
                key={category}
                className={'btn ' + (filter === category ? 'btn-primary' : 'btn-secondary')}
                onClick={() => setFilter(category)}
                style={{ 
                  fontSize: '0.9rem', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: filter === category 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'white',
                  color: filter === category ? 'white' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: filter === category ? '0 4px 15px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {category === 'all' ? '🌟 All Events' : 
                 category === 'academic' ? '📚 Academic' :
                 category === 'sports' ? '⚽ Sports' :
                 category === 'cultural' ? '🎭 Cultural' :
                 category === 'workshop' ? '🔧 Workshop' :
                 category === 'seminar' ? '💼 Seminar' : '🎯 Other'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid - 3 Cards per Row */}
      {filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>No events found</h3>
          <p style={{ color: '#94a3b8' }}>Try adjusting your filters or check back later for new events.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {filteredEvents.map((event, index) => (
            <div 
              key={event._id} 
              className="event-card" 
              onClick={() => handleEventClick(event._id)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                borderRadius: '20px',
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              {/* Event Image */}
              <div 
                style={{ 
                  height: '200px', 
                  position: 'relative',
                  ...getEventBackground(event)
                }}
              >
                {/* Category Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  background: 'rgba(255,255,255,0.95)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#667eea',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'capitalize'
                }}>
                  {event.category}
                </div>
                
                {/* Participants Count */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '1rem', 
                  left: '1rem', 
                  background: 'rgba(0,0,0,0.7)', 
                  color: 'white',
                  padding: '0.5rem 1rem', 
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  👥 {event.participants?.length || 0} registered
                  {event.maxParticipants > 0 && ` / ${event.maxParticipants}`}
                </div>

                {/* Event Organizer */}
                {event.createdBy && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '1rem', 
                    right: '1rem', 
                    background: 'rgba(0,0,0,0.7)', 
                    color: 'white',
                    padding: '0.5rem 1rem', 
                    borderRadius: '15px',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
                    👨‍🏫 {event.createdBy.name}
                  </div>
                )}
              </div>

              {/* Event Content */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  marginBottom: '0.75rem', 
                  color: '#1e293b',
                  fontSize: '1.4rem',
                  lineHeight: '1.3',
                  fontWeight: '600',
                  height: '3.6rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {event.title}
                </h3>
                
                <p style={{ 
                  color: '#64748b', 
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  height: '4.5rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {event.description}
                </p>

                {/* Event Meta Information */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                    <span style={{ fontSize: '1.1rem' }}>📍</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{event.venue}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                    <span style={{ fontSize: '1.1rem' }}>🏫</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{event.department}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event._id);
                  }}
                  style={{ 
                    width: '100%',
                    fontSize: '1rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    background: userRegistrations[event._id] 
                      ? '#10b981' 
                      : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    opacity: userRegistrations[event._id] ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!userRegistrations[event._id]) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!userRegistrations[event._id]) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {userRegistrations[event._id] ? '✅ Registered' : '🎯 View Details & Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;