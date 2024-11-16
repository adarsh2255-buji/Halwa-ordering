import React, { useState, useEffect } from 'react';
import api from '../api';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    phoneNumber: '',
    addressDetails: {
      houseName: '',
      pinCode: '',
      locality: '',
      district: '',
      state: '',
    },
  });

  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile and address data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await api.get('/auth/profile', { withCredentials: true });
        const profileData = profileResponse.data.user.profile;

        const addressResponse = await api.get('/auth/address', { withCredentials: true });
        const addressData = addressResponse.data.address;

        setFormData({
          username: profileData.username || '',
          gender: profileData.gender || '',
          phoneNumber: profileData.phoneNumber || '',
          addressDetails: {
            houseName: addressData?.houseName || '',
            pinCode: addressData?.pinCode || '',
            locality: addressData?.locality || '',
            district: addressData?.district || '',
            state: addressData?.state || '',
          },
        });
      } catch (error) {
        setMessage('Failed to fetch profile data');
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.addressDetails) {
      setFormData({
        ...formData,
        addressDetails: { ...formData.addressDetails, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Update profile
      const profilePayload = {
        username: formData.username,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
      };

      await api.put('/auth/profile/update', profilePayload, { withCredentials: true });

      // Update address
      const addressPayload = formData.addressDetails;
      await api.put('/auth/address/update', addressPayload, { withCredentials: true });

      setMessage('Profile and address updated successfully');
      setIsEditing(false); // Disable editing after save
    } catch (error) {
      setMessage(error.response?.data.message || 'An error occurred');
    }
  };

  // Handle toggling between edit and save
  const handleEditToggle = (e) => {
    e.preventDefault(); // Prevent any unintended form submission
    setIsEditing((prev) => !prev); // Toggle the editing state
    setMessage(''); // Clear previous messages
  };

  return (
    <>
      <div className="container mx-auto pt-12 mt-12">
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Personal Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            {/* Address Details */}
            <h3 className="text-lg font-medium mt-4">Address Details</h3>
            <div>
              <label className="block text-gray-700">House Name</label>
              <input
                type="text"
                name="houseName"
                value={formData.addressDetails.houseName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.addressDetails.pinCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.addressDetails.locality}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">District</label>
              <input
                type="text"
                name="district"
                value={formData.addressDetails.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.addressDetails.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
                disabled={!isEditing}
                required
              />
            </div>

            {/* Edit and Save Buttons */}
            {isEditing ? (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Edit
              </button>
            )}
          </form>

          {/* Message */}
          {message && <p className="text-center mt-4 text-green-600">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default Profile;
