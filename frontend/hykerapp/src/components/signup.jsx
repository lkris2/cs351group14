import {useState} from "react";
import Navbar from "./navbar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SignUp from "./signup.jsx";

export default function loginPage(){
    const [coverEyes, setCoverEyes] = useState(false);
    const navigate = useNavigate();

    const [isHovering, setIsHovering] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    async function handleSubmit(e) {
      e.preventDefault();
      setError(null);
      if (!email) {
        setError('Email is required');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/users/signup/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (res.status === 201) {
          console.log('User created', data);
          navigate('/RidePage');
        } else if (res.status === 409) {
          setError('An account with this email already exists. Please login instead.');
        } else if (!res.ok) {
          setError(data.error || 'Server error');
        }
      } catch (err) {
        console.error(err);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-[#4b0226] via-[#7b1742] to-[#f9f2e8] flex flex-col">
            <Navbar/>
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
                    <div className="bg-[#f9f2e8] flex flex-col items-center justify-center p-8">
                        <p className="text-xs tracking-[0.25em] uppercase text-pink-900/70 mb-4 mt-5">
                            HELLO, RIDER!
                        </p>
                        <Teddy isCoveringEyes={coverEyes} />

                        <Link 
                        to="/login" 
                        className="mt-10 underline text-amber-800"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          color: isHovering ? '#5919b9ff' : '#973c00',
                          fontWeight: "bold",
                          cursor: 'pointer'
                        }}> 
                        Already a Hyker? Login Through Here
                        </Link>
                        
                    </div>

                    <div className="p-8 flex flex-col justify-center bg-white">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#58062F] mb-2">
                            Your Next Ride Awaits...
                        </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#58062F] focus:border-[#58062F]"
                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#58062F] focus:border-[#58062F]"
                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#58062F] focus:border-[#58062F]"
                  onFocus={() => setCoverEyes(true)}
                  onBlur={()=> setCoverEyes(false)}
                />
                            </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex items-center justify-center scale-100">
                <button disabled={loading} type="submit" className="w-full mt-2 py-2.5 rounded-xl bg-[#58062F] text-white font-semibold text-sm shadow-lg hover:bg-[#7b1742] transition disabled:opacity-50">
                  {loading ? 'Processing...' : 'Create Your Account'}
                </button>
              </div>
                            <h1 className="m-7 text-center">or sign up with your account</h1>
                            
                            <div className="flex items-center justify-center scale-125 mb-5">
                              <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                  try {
                                    const decoded = jwtDecode(credentialResponse.credential);
                                    const email = decoded.email;
                                    const name = decoded.name || decoded.given_name || '';
                                    console.log('Google decoded', decoded);
                                    const res = await fetch('http://localhost:8000/api/users/oauth/google', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ email, name })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                      console.log('OAuth response', data);
                                      navigate('/RidePage');
                                    } else {
                                      console.error('OAuth error', data);
                                      setError(data.error || 'OAuth error');
                                    }
                                  } catch (err) {
                                    console.error('Google login handler error', err);
                                    setError('Google sign-in failed');
                                  }
                                }}
                                onError={() => setError('Google sign-in failed')}
                                size="large"
                              />

                            </div>
                            
                        </form>

                    </div>

                </div>
            </div>
        </div>
    )
}

function Teddy({ isCoveringEyes }) {
  const leftArmStyle = {
    transform: isCoveringEyes
      ? "translate(12px, -60px) rotate(18deg)" 
      : "translate(0px, 0px)",
    transition: "transform 0.25s ease-out",
  };

  const rightArmStyle = {
    transform: isCoveringEyes
      ? "translate(-12px, -60px) rotate(-18deg)"
      : "translate(0px, 0px)",
    transition: "transform 0.25s ease-out",
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      
      <div className="absolute inset-0 rounded-full bg-pink-100 shadow-lg" />

      
      <div className="absolute -top-0 left-9 w-10 h-10 bg-[#c48a5a] rounded-full border-4 border-[#f5d0a0]" />
      <div className="absolute -top-0 right-9 w-10 h-10 bg-[#c48a5a] rounded-full border-4 border-[#f5d0a0]" />

      
      <div className="relative w-32 h-32 bg-[#c48a5a] rounded-full border-4 border-[#f5d0a0] flex items-center justify-center z-10">
        
        <div className="w-24 h-20 bg-[#f5d0a0] rounded-full translate-y-2 flex flex-col items-center justify-center">
          
          <div className="flex justify-between w-14 mb-1 mt-1">
            <div className="w-3 h-3 bg-black rounded-full" />
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          
          <div className="w-4 h-3 bg-[#7a4b28] rounded-full" />
          <div className="w-6 h-4 border-b-2 border-[#7a4b28] rounded-b-full mt-0.5" />
        </div>
      </div>

      
      <div
        className="absolute w-10 h-15 bg-[#c48a5a] rounded-full origin-top left-6 top-28 z-20"
        style={{
            transform: isCoveringEyes
            ? "translate(35px, -60px) rotate(18deg)"   
            : "translate(0px, 0px)",
            transition: "transform 0.25s ease-out",
        }}
      />

      
      <div
        className="absolute w-10 h-15 bg-[#c48a5a] rounded-full origin-top right-6 top-28 z-20"
        style={{
            transform: isCoveringEyes
            ? "translate(-35px, -60px) rotate(-18deg)" 
            : "translate(0px, 0px)",
            transition: "transform 0.25s ease-out",
        }}
      />
    </div>
  );
}