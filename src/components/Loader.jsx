import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ padding: 16, textAlign: 'center' }}>
      <span>{text}</span>
    </div>
  );
}

