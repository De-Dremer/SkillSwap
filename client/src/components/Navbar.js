import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f4f4f4', marginBottom: '1rem' }}>
      <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
