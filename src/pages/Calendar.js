import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Style objects for better organization
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '4rem 2rem',
      borderRadius: '25px',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    headerDecoration: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '200px',
      height: '200px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%'
    },
    calendarCard: {
      background: 'white',
      padding: '2.5rem',
      borderRadius: '25px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2.5rem',
      padding: '1.5rem 2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.5)'
    },
    navButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '15px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    },
    dayHeader: {
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: 'white',
      padding: '1.2rem',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    calendarDay: {
      background: 'white',
      minHeight: '120px',
      padding: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      border: '1px solid #f1f5f9'
    },
    today: {
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      border: '2px solid #0ea5e9'
    },
    selected: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      border: '2px solid #3b82f6',
      transform: 'scale(1.02)',
      boxShadow: '0 5px 15px rgba(59, 130, 246, 0.2)'
    },
    eventList: {
      marginTop: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
    },
    eventCard: {
      padding: '1.5rem',
      background: 'white',
      borderRadius: '15px',
      border: '1px solid #e2e8f0',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();

    const days = [];

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={'prev-' + i} 
          style={{
            ...styles.calendarDay,
            background: '#f8fafc',
            color: '#cbd5e1'
          }}
        ></div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div 
          key={day} 
          style={{
            ...styles.calendarDay,
            ...(isToday ? styles.today : {}),
            ...(isSelected ? styles.selected : {})
          }}
          onClick={() => setSelectedDate(date)}
          onMouseEnter={(e) => {
            if (!isToday && !isSelected) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isToday && !isSelected) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <div style={{ 
            fontWeight: isToday ? 'bold' : '600',
            color: isToday ? '#0ea5e9' : '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '1.1rem'
          }}>
            {day}
          </div>
          <div style={{ maxHeight: '60px', overflow: 'hidden' }}>
            {dayEvents.slice(0, 2).map((event, index) => (
              <div key={event._id} style={{
                background: `linear-gradient(135deg, ${index === 0 ? '#3b82f6' : '#8b5cf6'})`,
                color: 'white',
                padding: '0.3rem 0.5rem',
                marginBottom: '0.3rem',
                borderRadius: '8px',
                fontSize: '0.7rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: '500'
              }}>
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div style={{
                color: '#64748b',
                fontSize: '0.7rem',
                textAlign: 'center',
                fontWeight: '600',
                background: '#f1f5f9',
                padding: '0.2rem',
                borderRadius: '6px',
                marginTop: '0.2rem'
              }}>
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '1.2rem',
          color: '#64748b'
        }}>
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerDecoration}></div>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1rem',
          fontWeight: '800',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          🗓️ Event Calendar
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          opacity: '0.95',
          fontWeight: '300',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Stay organized and never miss important campus events
        </p>
      </div>

      <div style={styles.calendarCard}>
        {/* Calendar Navigation */}
        <div style={styles.navigation}>
          <button 
            onClick={() => navigateMonth(-1)}
            style={styles.navButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            ← Previous
          </button>
          
          <h2 style={{ 
            margin: 0, 
            fontSize: '2rem',
            color: '#1e293b',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={() => navigateMonth(1)}
            style={styles.navButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={styles.calendarGrid}>
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {renderCalendar()}
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div style={styles.eventList}>
            <h3 style={{ 
              marginBottom: '1.5rem', 
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📅 Events on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            {getEventsForDate(selectedDate).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                color: '#64748b',
                fontSize: '1.1rem'
              }}>
                🎉 No events scheduled for this date
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {getEventsForDate(selectedDate).map(event => (
                  <div 
                    key={event._id} 
                    style={styles.eventCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                    }}
                  >
                    <h4 style={{ 
                      marginBottom: '0.75rem', 
                      color: '#1e293b',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {event.title}
                    </h4>
                    <p style={{ 
                      color: '#64748b', 
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {event.description}
                    </p>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#64748b',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <span>📍 {event.venue}</span>
                      <span>🕒 {new Date(event.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;