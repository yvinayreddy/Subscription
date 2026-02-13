const API_BASE = '/api';

/**
 * Generic request handler with error handling
 */
async function request(path, options = {}, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Get token from localStorage
 */
export const getToken = () => localStorage.getItem('token');

/**
 * User Authentication API
 */
export const authApi = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * User Profile API
 */
export const userApi = {
  getProfile: (userId) => {
    const token = getToken();
    return request(`/users/${userId}`, {}, token);
  },
  updateProfile: (userId, payload) => {
    const token = getToken();
    return request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
  }
};

/**
 * Plan API
 */
export const planApi = {
  getAll: () => request('/plans'),
  create: (payload) => {
    const token = getToken();
    return request('/plans', { method: 'POST', body: JSON.stringify(payload) }, token);
  },
  getById: (id) => request(`/plans/${id}`),
  update: (id, payload) => {
    const token = getToken();
    return request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
  },
  delete: (id) => {
    const token = getToken();
    return request(`/plans/${id}`, { method: 'DELETE' }, token);
  }
};

/**
 * Subscription API
 */
export const subscriptionApi = {
  create: (payload) => {
    const token = getToken();
    return request('/subscriptions', { method: 'POST', body: JSON.stringify(payload) }, token);
  },
  getAll: (query = {}) => {
    const token = getToken();
    const params = new URLSearchParams(query).toString();
    const suffix = params ? `?${params}` : '';
    return request(`/subscriptions${suffix}`, {}, token);
  },
  getById: (id) => {
    const token = getToken();
    return request(`/subscriptions/${id}`, {}, token);
  },
  cancel: (id) => {
    const token = getToken();
    return request(`/subscriptions/${id}/cancel`, { method: 'PUT' }, token);
  }
};

/**
 * Post API
 */
export const postApi = {
  getAll: (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit }).toString();
    return request(`/posts?${params}`);
  },
  getById: (id) => request(`/posts/${id}`),
  create: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    }).then(res => res.json()).then(data => {
      if (!data.ok) throw new Error(data.message);
      return data;
    });
  },
  delete: (id) => {
    const token = getToken();
    return request(`/posts/${id}`, { method: 'DELETE' }, token);
  }
};
