import React, { createContext, useState, useContext, useEffect } from 'react';
import { API } from '../services/apiInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem('finsphere_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      API.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('finsphere_user', JSON.stringify(data));
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('finsphere_user', JSON.stringify(data));
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('finsphere_user');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('finsphere_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};