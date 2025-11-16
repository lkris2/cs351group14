// src/components/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai"; // Using the same icon for consistency

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', formData); 
      
      const { token, userId, role } = res.data; 
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      console.log('Login successful. Token stored.');

      if (role === 'driver') {
        navigate('/driver-dashboard'); 
      } else {
        navigate('/find-ride'); 
      }

    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Login failed. Check your email and password.');
    }
  };

  return (
    // Outer container: Centers the form on the page, optional full screen background
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
      {/* Login Box: Uses your primary color #68224B */}
      <div className="flex flex-col items-center p-8 w-full max-w-sm bg-[#68224B] rounded-xl shadow-2xl text-white">
        
        {/* User Icon Circle: Uses your accent color pink-300 */}
        <div className="bg-pink-300 w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 text-[#68224B]">
          {<AiOutlineUser />}
        </div>
        
        <h2 className="text-2xl font-bold mb-6">User Login</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
          
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            // Input styling
            className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            // Input styling
            className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          
          {/* Submit Button: Uses a contrasting color, or the pink accent */}
          <button 
            type="submit"
            className="mt-4 p-3 rounded-lg bg-pink-300 text-[#68224B] font-semibold hover:bg-pink-400 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-200">
          Don't have an account? 
          <span 
            onClick={() => navigate('/signup')} 
            className="ml-1 text-pink-300 hover:text-white cursor-pointer font-medium transition"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}