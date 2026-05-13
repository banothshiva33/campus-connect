import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Registration form state
  const [formData, setFormData] = useState({
    studentId: '',
    phone: '',
    year: '',
    section: '',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);
      setEvent(response.data.event);
      
      // Check if user is registered
      if (user) {
        try {
          const registrationCheck = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/events/${eventId}/check-registration`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          );
          setIsRegistered(registrationCheck.data.isRegistered);
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/event/${eventId}` } });
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/event/${eventId}` } });
      return;
    }

    // Validate required fields
    if (!formData.studentId.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields (Student ID and Phone Number)');
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/${eventId}/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setIsRegistered(true);
      setShowRegistrationForm(false);
      
      alert('🎉 Registration successful! A confirmation email has been sent to your registered email address.');
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.message || 'You are already registered for this event!');
      } else if (error.response?.status === 401) {
        alert('Please log in to register for events.');
        navigate('/login');
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const closeForm = () => {
    setShowRegistrationForm(false);
    setFormData({
      studentId: '',
      phone: '',
      year: '',
      section: '',
      additionalInfo: ''
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="event-detail">
      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Register for {event.title}</h2>
              <button 
                onClick={closeForm}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleFormChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '1rem' 
                  }}
                  placeholder="Enter your student ID"
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '1rem' 
                  }}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '8px', 
                      fontSize: '1rem' 
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleFormChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '8px', 
                      fontSize: '1rem' 
                    }}
                    placeholder="e.g., A, B, C"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleFormChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    minHeight: '80px'
                  }}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={closeForm}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={registering}
                  style={{ flex: 1 }}
                >
                  {registering ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/events" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Events</Link>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {/* Event Image and Details */}
        <div>
<div
  style={{
    height: '400px',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    overflow: 'hidden'
  }}
>
  <img
    src={`${process.env.REACT_APP_API_URL}${event.image}`}
    alt={event.title}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>

          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Event Details</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Date & Time:</strong>
                <div>{new Date(event.date).toLocaleString()}</div>
              </div>
              
              <div>
                <strong>Venue:</strong>
                <div>{event.venue}</div>
              </div>
              
              <div>
                <strong>Category:</strong>
                <div>
                  <span style={{ 
                    background: '#2563eb', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div>
                <strong>Department:</strong>
                <div>{event.department}</div>
              </div>
              
              <div>
                <strong>Participants:</strong>
                <div>{event.participants?.length || 0} registered</div>
              </div>

              {event.maxParticipants > 0 && (
                <div>
                  <strong>Maximum Participants:</strong>
                  <div>{event.maxParticipants}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Section */}
        <div>
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Register for this Event</h2>
            
            {isRegistered ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3>Already Registered</h3>
                <p>You have successfully registered for this event.</p>
                <p style={{ color: '#10b981', fontWeight: '600' }}>
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h3>Secure Your Spot</h3>
                <p style={{ marginBottom: '2rem' }}>
                  Register now to participate in this exciting event. Fill out the registration form with your details.
                </p>
                
                {user ? (
                  <button 
                    className="btn btn-primary"
                    onClick={handleRegisterClick}
                    style={{ 
                      fontSize: '1.1rem', 
                      padding: '1rem 2rem'
                    }}
                  >
                    Register Now
                  </button>
                ) : (
                  <div>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>
                      Please log in to register for this event.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/login', { state: { from: `/event/${eventId}` } })}
                    >
                      Log In to Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>About this Event</h3>
            <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{event.description}</p>
          </div>

          {/* Event Organizer */}
          {event.createdBy && (
            <div className="card" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Event Organizer</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {event.createdBy.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{event.createdBy.name}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {event.createdBy.email}
                  </div>
                  {event.createdBy.department && (
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {event.createdBy.department}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;