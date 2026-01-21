import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { createUser, listUsers, updateUser, softDeleteUser } from '../apis/users.api.js';
import { addLog } from '../apis/logs.api.js';
import '../styles/ui.css';

export default function Users() {
  const [query, setQuery] = useState({ search: '', role: '', status: '', page: 1, limit: 10 });
  const [data, setData] = useState({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'user', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const resp = await listUsers({ ...query });
      setData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (form.id) {
        await updateUser(form.id, { name: form.name, email: form.email, role: form.role, status: form.status });
        await addLog('user.update.ui', { id: form.id });
      } else {
        await createUser({ name: form.name, email: form.email, role: form.role, status: form.status });
        await addLog('user.create.ui', { email: form.email });
      }
      setForm({ id: null, name: '', email: '', role: 'user', status: 'active' });
      fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (u) => {
    setForm({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status });
  };

  const onDelete = async (id) => {
    if (!confirm('Soft delete this user?')) return;
    await softDeleteUser(id);
    fetchData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <div className="controls">
          <button className="btn btn-ghost" onClick={() => fetchData()}>Refresh</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="controls">
          <input
            className="input"
            placeholder="Search name/email"
            value={query.search}
            onChange={(e) => setQuery(q => ({ ...q, search: e.target.value, page: 1 }))}
          />
          <select
            className="select"
            value={query.role}
            onChange={(e) => setQuery(q => ({ ...q, role: e.target.value, page: 1 }))}
          >
            <option value="">All roles</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <select
            className="select"
            value={query.status}
            onChange={(e) => setQuery(q => ({ ...q, status: e.target.value, page: 1 }))}
          >
            <option value="">All status</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <button className="btn btn-primary" onClick={() => fetchData()}>Apply</button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card" style={{ marginBottom: 12, maxWidth: 800 }}>
        <h3 style={{ marginTop: 0 }}>{form.id ? 'Edit User' : 'Add User'}</h3>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <select
            className="select"
            value={form.role}
            onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <select
            className="select"
            value={form.status}
            onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
        <div className="form-row" style={{ marginTop: 8 }}>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (form.id ? 'Update' : 'Create')}
          </button>
          {form.id && (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setForm({ id: null, name: '', email: '', role: 'user', status: 'active' })}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <div style={{ color: '#ffb3b3', marginTop: 6 }}>{error}</div>}
      </form>

      {loading ? <Loader /> : (
        <div className="card">
          {data.data.length === 0 ? (
            <div className="empty-state">No users found. Try adjusting filters or add a new user.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ width: 140 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge">{u.role}</span>
                      </td>
                      <td>
                        <span className={u.status === 'active' ? 'badge badge-success' : 'badge badge-muted'}>
                          {u.status}
                        </span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleString()}</td>
                      <td>
                        <div className="form-row">
                          <button className="btn btn-ghost" onClick={() => onEdit(u)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => onDelete(u.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages || 1}
            onChange={(p) => setQuery(q => ({ ...q, page: p }))}
          />
        </div>
      )}
    </div>
  );
}

