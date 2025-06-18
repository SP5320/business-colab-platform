export const AUTH_CHANGE_EVENT = 'authStateChanged';

export const emitAuthChange = () => {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, {
    detail: { authenticated: isAuthenticated() }
  }));
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const login = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  emitAuthChange();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');  
  emitAuthChange();
};