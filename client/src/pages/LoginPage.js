import React from 'react';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const LoginPage = () => {
  const handleLogin = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      // navigate to profile or dashboard next
    } catch (err) {
      console.error(err);
      alert('Login failed!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;

