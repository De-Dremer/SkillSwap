import React from 'react';
import AuthForm from '../components/AuthForm';
import axios from 'axios';

const RegisterPage = () => {
  const handleRegister = async (formData) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please login.');
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
