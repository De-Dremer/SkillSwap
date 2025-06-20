import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/auth/protected', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Profile</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default ProfilePage;
