const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  const data = await response.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.data;
};

const api = {
  register: (name, email, password) => fetchWithAuth('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),

  login: (email, password) => fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getOwnProfile: () => fetchWithAuth('/users/me'),

  getUsers: () => fetchWithAuth('/users'),

  getThreads: () => fetchWithAuth('/threads'),

  getThreadDetail: (threadId) => fetchWithAuth(`/threads/${threadId}`),

  createThread: (title, body, category) => fetchWithAuth('/threads', {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  }),

  createComment: (threadId, content) => fetchWithAuth(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  upVoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/up-vote`, { method: 'POST' }),
  downVoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/down-vote`, { method: 'POST' }),
  neutralVoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/neutral-vote`, { method: 'POST' }),

  upVoteComment: (threadId, commentId) => fetchWithAuth(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST' }),
  downVoteComment: (threadId, commentId) => fetchWithAuth(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST' }),
  neutralVoteComment: (threadId, commentId) => fetchWithAuth(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST' }),

  getLeaderboard: () => fetchWithAuth('/leaderboards'),
};

export default api;
