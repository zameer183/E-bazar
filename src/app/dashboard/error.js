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
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        Try again
      </button>
    </div>
  );
}
