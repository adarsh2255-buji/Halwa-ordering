import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api';
import { UserContext } from '../context/UserContext';

const Login = () => {
    const [formData, SetFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState("");
    const { handleLogin } = useContext( UserContext )

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name , value} = e.target;
        SetFormData({...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const response = await api.post('/auth/login', formData);
            console.log(response.data)
            if(response.data){
                handleLogin(response.data);
                setSuccess("Login successful");
                SetFormData({
                    email: '',
                    password: '',
                })
            }
            setError("");
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || "Login failed")
            console.log(error.response?.data?.message)
        }
    };
  return (
    <>
    {/* Signup Form */}
    <div className="container">
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-semibold text-center mb-6'>Log In here</h2>

                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                {success && <p className='text-green-500 text-center mb-4'>{success}</p>}

                <form onSubmit={handleSubmit} className='sapce-y-4'>
                    {/* email */}
                    <div>
                        <label className='block text-gray-700'>Email</label>
                        <input 
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                        required
                        />
                    </div>

                    {/* password */}
                    <div>
                        <label className='block text-gray-700'>Password</label>
                        <input 
                        type="password"
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                        autoComplete='true'
                        required
                        />
                    </div>

                    {/* submit button */}
                    <button type='submit' 
                    className='w-full  bg-indigo-600 text-white py-2 mt-4 rounded-md hover:bg-indigo-700 transition duration-200'>
                        Sign Up
                    </button>

                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login;