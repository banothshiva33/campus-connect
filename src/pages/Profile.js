import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, login, isStudent, isTeacher, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchUserData();
    initializeProfileData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (isStudent()) {
        const registrationsRes = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/events/my/registrations', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRegistrations(registrationsRes.data.registrations || []);
        
        setUserStats({
          totalRegistrations: registrationsRes.data.registrations?.length || 0,
          upcomingEvents: registrationsRes.data.registrations?.filter(reg => 
            new Date(reg.event.date) > new Date()
          ).length || 0,
          attendedEvents: registrationsRes.data.registrations?.filter(reg => 
            reg.status === 'attended'
          ).length || 0
        });
      }
      
      if (isTeacher()) {
        const eventsRes = await axios.get('https://campusconnect-backend-ux8p.onrender.com/api/events');
        const myEvents = eventsRes.data.events.filter(event => 
          event.createdBy._id === user._id
        );
        setCreatedEvents(myEvents);
        
        const totalParticipants = myEvents.reduce((sum, event) => 
          sum + (event.participants?.length || 0), 0
        );
        
        setUserStats({
          createdEvents: myEvents.length,
          totalParticipants: totalParticipants,
          upcomingEvents: myEvents.filter(event => 
            new Date(event.date) > new Date()
          ).length,
          activeEvents: myEvents.filter(event => event.isActive).length
        });
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeProfileData = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      studentId: user.studentId || '',
      year: user.year || '',
      section: user.section || '',
      department: user.department || ''
    });
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Profile photo should be less than 2MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await axios.put('https://campusconnect-backend-ux8p.onrender.com/api/users/profile', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update user context with new data
        login(response.data.user);
        alert('Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload profile photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);

    try {
      const response = await axios.put('https://campusconnect-backend-ux8p.onrender.com/api/users/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Update user context with new data
        login(response.data.user);
        setEditMode(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'teacher': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'admin': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProfilePhotoUrl = () => {
    if (user.profilePhoto) {
      return `https://campusconnect-backend-ux8p.onrender.com${user.profilePhoto}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading-spinner" style={{ fontSize: '2rem' }}>⏳</div>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 2 }}>
          {/* Profile Photo Section */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: getProfilePhotoUrl() 
                ? `url(${getProfilePhotoUrl()}) center/cover`
                : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: getProfilePhotoUrl() ? '0' : '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              overflow: 'hidden'
            }}>
              {!getProfilePhotoUrl() && getInitials(user.name)}
              {getProfilePhotoUrl() && (
                <img 
                  src={getProfilePhotoUrl()} 
                  alt="Profile" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              )}
            </div>
            
            {/* Photo Upload Button */}
            <label 
              htmlFor="profile-photo-upload"
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                background: 'rgba(255,255,255,0.9)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#667eea',
                border: '2px solid #667eea',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)';
                e.target.style.color = '#667eea';
              }}
            >
              {uploadingPhoto ? '⏳' : '📷'}
            </label>
            
            <input
              type="file"
              id="profile-photo-upload"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              style={{ display: 'none' }}
              disabled={uploadingPhoto}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {user.name}
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1rem' }}>
              {user.email}
            </p>
            <div style={{
              display: 'inline-block',
              background: getRoleBadgeColor(user.role),
              padding: '0.5rem 1.5rem',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'capitalize',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              {user.role} • {user.department}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {isStudent() && (
          <>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>📅</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.totalRegistrations || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Total Registrations</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#10b981' }}>🔜</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.upcomingEvents || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Upcoming Events</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#f59e0b' }}>✅</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.attendedEvents || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Events Attended</p>
            </div>
          </>
        )}

        {isTeacher() && (
          <>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>📝</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.createdEvents || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Events Created</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#10b981' }}>👥</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.totalParticipants || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Total Participants</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#f59e0b' }}>🔜</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                {userStats.upcomingEvents || 0}
              </h3>
              <p style={{ color: '#64748b', fontWeight: '500' }}>Upcoming Events</p>
            </div>
          </>
        )}
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        background: 'white', 
        borderRadius: '15px', 
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          borderBottom: '2px solid #f1f5f9',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
              color: activeTab === 'overview' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Overview
          </button>
          
          {isStudent() && (
            <button
              onClick={() => setActiveTab('registrations')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'registrations' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: activeTab === 'registrations' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🎫 My Registrations
            </button>
          )}
          
          {isTeacher() && (
            <button
              onClick={() => setActiveTab('events')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'events' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: activeTab === 'events' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📅 My Events
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'edit' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
              color: activeTab === 'edit' ? 'white' : '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ✏️ Edit Profile
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem 0' }}>
          {/* Edit Profile Tab */}
          {activeTab === 'edit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#1e293b' }}>Edit Profile</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {editMode ? (
                    <>
                      <button 
                        onClick={handleProfileSave}
                        disabled={savingProfile}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: savingProfile ? 'not-allowed' : 'pointer',
                          opacity: savingProfile ? 0.7 : 1
                        }}
                      >
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditMode(false);
                          initializeProfileData();
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: '#64748b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditMode(true)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div style={{ 
                background: '#f8fafc', 
                padding: '2rem', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: editMode ? 'white' : '#f8fafc'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: editMode ? 'white' : '#f8fafc'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: editMode ? 'white' : '#f8fafc'
                      }}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {isStudent() && (
                    <>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          Student ID
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          value={profileData.studentId}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: editMode ? 'white' : '#f8fafc'
                          }}
                          placeholder="Enter your student ID"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          Year
                        </label>
                        <select
                          name="year"
                          value={profileData.year}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: editMode ? 'white' : '#f8fafc'
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                          Section
                        </label>
                        <input
                          type="text"
                          name="section"
                          value={profileData.section}
                          onChange={handleProfileChange}
                          disabled={!editMode}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: editMode ? 'white' : '#f8fafc'
                          }}
                          placeholder="Enter your section"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: editMode ? 'white' : '#f8fafc'
                      }}
                    />
                  </div>
                </div>

                {!editMode && (
                  <div style={{ 
                    marginTop: '2rem', 
                    padding: '1.5rem',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#64748b', margin: 0 }}>
                      Click "Edit Profile" to update your information
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs (Overview, Registrations, Events) - Keep your existing code here */}
          {/* ... (Your existing tab content for overview, registrations, events) ... */}
        </div>
      </div>
    </div>
  );
};

export default Profile;