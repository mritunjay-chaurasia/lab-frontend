import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader.jsx';
import { syncAgents } from '../apis/elevenlabs.api.js';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(null);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const resp = await syncAgents();
      setSynced(resp.synced);
      setAgents(resp.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  return (
    <div>
      <h2>ElevenLabs Agents</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={fetchAgents}>Sync Agents</button>
        {synced !== null && <span style={{ marginLeft: 8 }}>Synced: {synced}</span>}
      </div>
      {loading ? <Loader /> : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>External ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.external_id}</td>
                <td>{a.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

