import React from 'react';

const Forbidden = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000', // optional: to make white text visible
        color: 'white',
        textAlign: 'center'
      }}
    >
      <h2>403 - Forbidden</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default Forbidden;
