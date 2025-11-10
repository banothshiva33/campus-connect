import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section with Background Image */}
      <section className="hero" style={{
        background: 'linear-gradient(rgba(37, 99, 235, 0.8), rgba(30, 64, 175, 0.8)), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '6rem 2rem',
        borderRadius: '15px',
        marginBottom: '4rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Welcome to CampusConnect</h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', opacity: '0.95', lineHeight: '1.6' }}>
            Your central hub for all academic and extracurricular events across campus. 
            Discover, register, and engage with your campus community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ 
              background: 'white', 
              color: '#2563eb', 
              fontSize: '1.2rem', 
              padding: '1rem 2.5rem',
              fontWeight: '600',
              borderRadius: '50px',
              textDecoration: 'none'
            }}>
              Get Started
            </Link>
            <Link to="/events" className="btn" style={{ 
              background: 'transparent', 
              color: 'white', 
              fontSize: '1.2rem', 
              padding: '1rem 2.5rem',
              fontWeight: '600',
              border: '2px solid white',
              borderRadius: '50px',
              textDecoration: 'none'
            }}>
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Image */}
      <section style={{ padding: '4rem 0' }}>
        <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Students collaborating"
              style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Connect, Learn, and Grow Together</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#64748b', marginBottom: '2rem' }}>
              CampusConnect brings students, teachers, and administrators together in one platform. 
              From academic seminars to cultural festivals, sports events to workshops - never miss 
              an opportunity to engage with your campus community.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>✓</div>
                <span>Easy event discovery and registration</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>✓</div>
                <span>Real-time notifications and reminders</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>✓</div>
                <span>Seamless communication between stakeholders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#f8fafc', padding: '5rem 2rem', borderRadius: '15px', margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: '#1e293b' }}>How It Works</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Simple steps to get started with CampusConnect and make the most of campus life
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ background: '#2563eb', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 2rem', fontWeight: 'bold' }}>1</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Create Your Account</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Sign up as a student, teacher, or administrator to access personalized features</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ background: '#2563eb', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 2rem', fontWeight: 'bold' }}>2</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Explore Events</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Browse through hundreds of academic, cultural, sports, and workshop events</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ background: '#2563eb', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 2rem', fontWeight: 'bold' }}>3</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>Register & Engage</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Register with one click, receive confirmations, and participate in campus life</p>
          </div>
        </div>
      </section>

      {/* Second Image Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Built for Everyone</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#64748b', marginBottom: '2rem' }}>
              Whether you're a student looking to participate, a teacher organizing events, 
              or an administrator managing campus activities - CampusConnect provides the 
              tools you need to succeed.
            </p>
            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍🎓</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Students</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Discover and register for events</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍🏫</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Teachers</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Create and manage events</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍💼</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Admins</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Oversee campus activities</p>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Campus life"
              style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', padding: '4rem 2rem', borderRadius: '15px', textAlign: 'center' }}>
        <div className="grid grid-3">
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>500+</h2>
            <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Events Organized</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>2K+</h2>
            <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Active Students</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>50+</h2>
            <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Departments</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Ready to Transform Campus Life?</h2>
        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto' }}>
          Join thousands of students and teachers who are already making the most of their campus experience
        </p>
        <Link to="/register" className="btn" style={{ 
          background: '#2563eb', 
          color: 'white', 
          fontSize: '1.2rem', 
          padding: '1.2rem 3rem',
          fontWeight: '600',
          borderRadius: '50px',
          textDecoration: 'none',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
        }}>
          Join CampusConnect Today
        </Link>
      </section>
    </div>
  );
};

export default Home;
