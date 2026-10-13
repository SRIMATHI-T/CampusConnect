const API_URL = (process.env.REACT_APP_API_URL || '/api/v1').replace(/\/$/, '');
export function getToken() { return localStorage.getItem('cc_token'); }
export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && options.body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status; error.errors = data.errors;
    throw error;
  }
  return data;
}
export function uploadUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiOrigin = API_URL.startsWith('http') ? new URL(API_URL).origin : '';
  return `${apiOrigin}${url}`;
}
