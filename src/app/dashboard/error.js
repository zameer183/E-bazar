"use client";

export default function DashboardError({ error, reset }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f6f0e4, #e6e2db)'
    }}>
      <h2 style={{
        color: '#c53030',
        marginBottom: '1rem',
        fontWeight: '800',
        fontSize: '1.8rem',
        letterSpacing: '-0.02em'
      }}>
        Something went wrong!
      </h2>
      <p style={{
        color: 'rgba(47, 47, 47, 0.7)',
        marginBottom: '2rem',
        lineHeight: '1.7',
        maxWidth: '500px'
      }}>
        {error.message || 'Unable to load dashboard. Please try again.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: '#2f2f2f',
          color: '#f6f0e4',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 16px rgba(47, 47, 47, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Try again
      </button>
    </div>
  );
}
