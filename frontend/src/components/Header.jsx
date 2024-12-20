import React, { useRef, useEffect, useState, useContext } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { MdHome, MdExplore, MdAccountCircle, MdShoppingCart } from "react-icons/md";
import api from '../api';

// import { useUser } from '../context/UserContext';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // const { user, setUser } = useUser();
    const { user,username,  logout } = useContext(UserContext)
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Toggle profile dropdown
    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        logout() // Clear user state to log out
        navigate('/'); // Redirect to homepage
    };

    //Get user namw from user profile

    

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Link to='/' className='text-2xl font-bold text-gray-800'>HalwaStore</Link>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden md:flex items-center w-1/2 bg-gray-100 px-2 py-1 rounded-lg">
                    <FaSearch className="text-gray-600" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-transparent focus:outline-none text-gray-700 w-full px-2"
                    />
                </div>

                <p className="block  text-black">{username}</p>
                {/* Profile and Cart */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef} >
                        <CgProfile 
                            className="text-2xl text-gray-600 cursor-pointer" 
                            onClick={toggleProfileDropdown}
                        />
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2">
                                {user ? (
                                    <>
                                        
                                        <Link to='/profile' className="block px-4 py-2 text-gray-600 hover:bg-gray-100">My Profile</Link>
                                        <Link to='/orders' className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Orders</Link>
                                        <button onClick={handleLogoutClick} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Log Out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to='/signup' className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Sign Up</Link>
                                        <Link to='/login' className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Log In</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart Icon */}
                    <div className="text-gray-600 relative">
                        <IoMdCart className="text-2xl" />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                            {/* Display count if available */}
                            {/* {user?.cartItems?.length || 0} */}
                        </span>
                    </div>
                </div>
            </div>
            {/* Mobile Search Bar */}
      <div className="flex md:hidden items-center bg-gray-100 px-2 py-1 rounded-lg mx-4 mt-2">
        <FaSearch className="text-gray-600" />
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-transparent focus:outline-none text-gray-700 w-full px-2"
        />
      </div>

      {/* Mobile Navbar */}
      <div className="fixed inset-x-0 bottom-0 bg-white shadow-lg md:hidden flex justify-around py-2">
        <a href="/" className="flex flex-col items-center text-gray-600">
          <MdHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </a>
        <a href="/explore" className="flex flex-col items-center text-gray-600">
          <MdExplore className="text-2xl" />
          <span className="text-xs">Explore</span>
        </a>
        <a href="/account" className="flex flex-col items-center text-gray-600">
          <MdAccountCircle className="text-2xl" />
          <span className="text-xs">Account</span>
        </a>
        <a href="/cart" className="flex flex-col items-center text-gray-600">
          <MdShoppingCart className="text-2xl" />
          <span className="text-xs">Cart</span>
        </a>
      </div>
        </header>
    );
};

export default Header;
