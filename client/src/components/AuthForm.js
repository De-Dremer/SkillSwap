import React, { useState } from 'react';

const AuthForm = ({ type, onSubmit }) => {
  const isLogin = type === 'login';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
      )}
      <div>
        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
    </form>
  );
};

export default AuthForm;
