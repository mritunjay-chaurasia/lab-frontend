import clientApi from './index.js';

export async function createUser(payload) {
  const { data } = await clientApi.post('/users', payload);
  return data;
}

export async function listUsers(params) {
  const { data } = await clientApi.get('/users', { params });
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await clientApi.put(`/users/${id}`, payload);
  return data;
}

export async function softDeleteUser(id) {
  const { data } = await clientApi.delete(`/users/${id}`);
  return data;
}

