import clientApi from './index.js';

export async function listLogs(params) {
  const { data } = await clientApi.get('/logs', { params });
  return data;
}

export async function addLog(action, details) {
  const { data } = await clientApi.post('/logs', { action, details });
  return data;
}

