// Login Page - OAuth2 Authentication Flow
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    // Build OAuth authorization URL using environment variables
    const clientId = process.env.REACT_APP_ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_ZOHO_REDIRECT_URI || process.env.ZOHO_REDIRECT_URI;
    const scopes = 'ZohoCRM.modules.leads.READ,ZohoCRM.modules.leads.WRITE,ZohoCRM.modules.ALL';
    
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${encodeURIComponent(scopes)}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect to Zoho OAuth authorization endpoint
    window.location.href = authUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Forbes Burton AI System</h1>
        <p style={styles.subtitle}>Next-generation CRM powered by Zoho integration</p>
        
        <button onClick={handleLogin} style={styles.button}>
          🔐 Sign in with Zoho CRM
        </button>
        
        <p style={styles.info}>
          You will be redirected to Zoho to authorize this application
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
  },
  title: {
    color: '#333',
    marginBottom: '0.5rem',
    fontSize: '1.75rem'
  },
  subtitle: {
    color: '#666',
    marginBottom: '2rem',
    fontSize: '0.95rem'
  },
  button: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    width: '100%',
    marginBottom: '1rem'
  },
  info: {
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '1rem'
  }
};

export default Login;
