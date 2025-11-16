// src/components/SignupPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUserAdd } from "react-icons/ai"; // A slightly different icon for sign-up

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'rider', // Default role is 'rider'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to the backend signup route
      const res = await axios.post('http://localhost:5000/api/users/signup', formData);

      console.log('Sign up successful:', res.data);
      alert('Registration successful! Please log in.');
      
      // Redirect to the login page after successful registration
      navigate('/login'); 

    } catch (err) {
      console.error('Sign up failed:', err.response?.data || err.message);
      // Display error message from the backend
      alert(err.response?.data?.msg || 'Registration failed. Please check the details.');
    }
  };

  return (
    // Outer container: Centers the form on the page, optional full screen background
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
      {/* Sign Up Box: Uses your primary color #68224B */}
      <div className="flex flex-col items-center p-8 w-full max-w-sm bg-[#68224B] rounded-xl shadow-2xl text-white">
        
        {/* Icon Circle: Uses your accent color pink-300 */}
        <div className="bg-pink-300 w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 text-[#68224B]">
          {<AiOutlineUserAdd />}
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
          
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          {/* Role Selector */}
          <div className="flex justify-between items-center p-3 bg-[#7e3061] rounded-lg">
            <label htmlFor="role" className="font-medium">Sign up as:</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className="mt-4 p-3 rounded-lg bg-pink-300 text-[#68224B] font-semibold hover:bg-pink-400 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-200">
          Already have an account? 
          <span 
            onClick={() => navigate('/login')} 
            className="ml-1 text-pink-300 hover:text-white cursor-pointer font-medium transition"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}