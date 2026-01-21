import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { syncConversations, syncAgents } from '../apis/elevenlabs.api.js';


export default function Conversations() {
  const [agentFilter, setAgentFilter] = useState('');
  const [agents, setAgents] = useState([]);
  const [data, setData] = useState({ data: [], meta: { page: 1, limit: 10, total: 0 } });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadAgents = async () => {
    try {
      const { data } = await syncAgents();
      setAgents(data.data || []);
    } catch { }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const resp = await syncConversations({ agent_external_id: agentFilter || undefined, page, limit: 10 });
      setData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAgents(); }, []);
  useEffect(() => { fetchConversations(); }, [agentFilter, page]);

  return (
    <div>
      <h2>ElevenLabs Conversations</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <select value={agentFilter} onChange={(e) => { setPage(1); setAgentFilter(e.target.value); }}>
          <option value="">All agents</option>
          {agents.map(a => (
            <option key={a.external_id} value={a.external_id}>{a.name}</option>
          ))}
        </select>
        <button onClick={() => { setPage(1); fetchConversations(); }}>Sync & Refresh</button>
      </div>
      {loading ? <Loader /> : (
        <>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>External ID</th>
                <th>Agent External ID</th>
                <th>Title</th>
                <th>Started At</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.external_id}</td>
                  <td>{c.agent_external_id}</td>
                  <td>{c.title}</td>
                  <td>{c.started_at ? new Date(c.started_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={data.meta.page} totalPages={Math.ceil((data.meta.total || 0) / 10)} onChange={setPage} />
        </>
      )}
    </div>
  );
}

