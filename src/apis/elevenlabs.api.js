import clientApi from './index.js';

export async function syncAgents() {
  const { data } = await clientApi.get('/elevenlabs/agents');
  return data;
}

export async function syncConversations(params) {
  const { data } = await clientApi.get('/elevenlabs/conversations', { params });
  return data;
}

