import React, { useState } from 'react'
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
      state : '',
    }
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name in formData.addressDetails) {
      setFormData({
        ...formData,
        addressDetails: {...formData.addressDetails, [name] : value },
      });
    } else {
      setFormData({ ...formData, [name] : value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/profile', formData, {withCredentials: true});
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "An error occurred");
    }
    }
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
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className="text-center mt-4 text-green-600">{message}</p>
                )}
            </div>
        </div>
    </>
  )
}

export default Profile