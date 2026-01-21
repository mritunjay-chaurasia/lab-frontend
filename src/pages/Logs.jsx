import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { listLogs } from '../apis/logs.api.js';
import '../styles/ui.css';

export default function Logs() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], meta: { page: 1, limit: 10, total: 0 } });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await listLogs({ page, limit: 10 });
      setData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Activity Logs</h2>
        <div className="controls">
          <button className="btn btn-ghost" onClick={() => fetchData()}>Refresh</button>
        </div>
      </div>
      {loading ? <Loader /> : (
        <div className="card">
          {data.data.length === 0 ? (
            <div className="empty-state">No logs to display.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(log => {
                    const detailsStr = (() => {
                      try { return JSON.stringify(log.details, null, 2); } catch { return String(log.details); }
                    })();
                    const preview = detailsStr.length > 80 ? detailsStr.slice(0, 80) + '…' : detailsStr;
                    return (
                      <tr key={log.id}>
                        <td><span className="badge">{log.action}</span></td>
                        <td className="json-cell">
                          <details>
                            <summary style={{ cursor: 'pointer' }}>{preview || '(empty)'}</summary>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{detailsStr}</pre>
                          </details>
                        </td>
                        <td>{new Date(log.created_at).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            page={data.meta.page}
            totalPages={Math.ceil((data.meta.total || 0) / 10)}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

