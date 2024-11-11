import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    username: '',
    gender: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/profile', { withCredentials: true });
        setProfile(response.data.profile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // Handle form submission to create or update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/profile', profile, { withCredentials: true });
      console.log(response.data.message);
      setIsEditing(false); // Set back to read-only mode after saving
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-2 border rounded-md ${
                isEditing ? 'border-blue-500' : 'border-gray-300 bg-gray-100'
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={profile.gender === 'male'}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={profile.gender === 'female'}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={profile.gender === 'other'}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                Other
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-2 border rounded-md ${
                isEditing ? 'border-blue-500' : 'border-gray-300 bg-gray-100'
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-2 border rounded-md ${
                isEditing ? 'border-blue-500' : 'border-gray-300 bg-gray-100'
              }`}
              rows="3"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleEdit}
              className="text-blue-500 hover:underline"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
