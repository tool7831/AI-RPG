
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
    return fetchWithAuth(process.env.REACT_APP_FAST_API_URL + '/load_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }})
}