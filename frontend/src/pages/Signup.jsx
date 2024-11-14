import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api';
import { useUser } from '../context/UserContext';

const Signup = () => {
    // const [formData, SetFormData] = useState({
    //     email: '',
    //     password: '',
    //     confirmPassword: ''
    // });
  
    const [ email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState("");

    const { setUser } = useUser();
    

    const navigate = useNavigate()
    // const handleChange = (e) => {
    //     const { name , value} = e.target;
    //     SetFormData({...formData, [name]: value });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        // validation
        if (password!== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
          }

        try {
            const response = await api.post('/auth/signup', { email, password });
            setUser(response.data.user)
            setSuccess("Signup successful");
            console.log(email);
            console.log(password)
            //clear email and password
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError("");
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed")
            console.log(error.response?.data?.message)
        }
    };
  return (
    <>
    {/* Signup Form */}
    <div className="container">
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-semibold text-center mb-6'> Create An Account</h2>

                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                {success && <p className='text-green-500 text-center mb-4'>{success}</p>}

                <form onSubmit={handleSubmit} className='sapce-y-4'>
                    {/* email */}
                    <div>
                        <label className='block text-gray-700'>Email</label>
                        <input 
                        type="email"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                        autoComplete='true'
                        required
                        />
                    </div>

                    {/* confirm password */}
                    <div>
                        <label className='block text-gray-700'>Confirm Password</label>
                        <input 
                        type="password"
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

export default Signup;