import React from 'react';
import '../styles/ui.css';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const prev = (e) => { e?.preventDefault?.(); onChange(Math.max(1, page - 1)); };
  const next = (e) => { e?.preventDefault?.(); onChange(Math.min(totalPages, page + 1)); };
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
      <button type="button" className="btn btn-ghost" onClick={prev} disabled={page <= 1}>Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" className="btn btn-ghost" onClick={next} disabled={page >= totalPages}>Next</button>
    </div>
  );
}

