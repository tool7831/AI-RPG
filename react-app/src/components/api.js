
export function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers = options.headers || {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    return fetch(url, {
      ...options,
      headers,
    });
  }

export function loadData() {
    return fetchWithAuth('http://localhost:8000/load_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }})
}