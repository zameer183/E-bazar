'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Seller Page Error</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        {error?.message || 'Failed to load seller information'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
