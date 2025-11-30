import {useState, useContext, useRef } from "react";
import Navbar from "./navbar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SignUp from "./signup.jsx";
import { AuthContext } from "../Authcontext.jsx";

export default function Profile() {
    const imageModules = import.meta.glob('../assets/person*.png', { eager: true, as: 'url' });
    const imageList = Object.values(imageModules || {});
    const [selectedImage, setSelectedImage] = useState(imageList[0] || '');
    const [pickerOpen, setPickerOpen] = useState(false);
    const fileInputRef = useRef(null);

    function handleFileChange(e) {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setSelectedImage(url);
        setPickerOpen(false);
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-[#4b0226] via-[#7b1742] to-[#f9f2e8] flex flex-col">
            <Navbar/>
            <div className="w-full max-w-5xl mx-auto mt-8 px-4">
                <div className="bg-[#f9f2e8] rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-center">
                    {/* left: avatar block */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="relative">
                            <button onClick={() => setPickerOpen(v => !v)} aria-label="Change profile photo" className="rounded-full overflow-hidden border-4 border-white shadow-lg focus:outline-none">
                                <img src={selectedImage || '/favicon.ico'} alt="avatar" className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full" />
                            </button>
                            {pickerOpen && (
                                <div className="absolute z-50 left-1/2 transform -translate-x-1/2 top-full mt-3 bg-white p-3 rounded-lg shadow-lg w-64">
                                    <div className="text-sm font-medium mb-2">Choose a photo</div>
                                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-auto">
                                        {imageList.length ? imageList.map((url, i) => (
                                            <button key={i} onClick={() => { setSelectedImage(url); setPickerOpen(false); }} className="rounded overflow-hidden w-12 h-12">
                                                <img src={url} className="w-12 h-12 object-cover" alt={`person-${i}`} />
                                            </button>
                                        )) : (
                                            <div className="text-xs text-gray-500">No bundled avatars</div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-sm px-3 py-1 bg-pink-700 text-white rounded">Upload</button>
                                        <button onClick={() => { setSelectedImage(imageList[0] || ''); setPickerOpen(false); }} className="text-sm px-3 py-1 border rounded">Reset</button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-md tracking-[0.25em] uppercase text-pink-900/70 mb-0">USER'S NAME</p>
                            <p className="text-sm text-gray-600">@username</p>
                        </div>
                    </div>
                    {/* right: stats & fun facts */}
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-pink-900">Profile Summary</h3>
                        <p className="text-sm text-pink-900/70 mt-2">Short bio or summary goes here. You can show recent rides, preferences, or quick links.</p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-pink-700">12</div>
                                <div className="text-xs text-pink-900/60">Rides</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-700">4.9</div>
                                <div className="text-xs text-pink-900/60">Rating</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-700">34</div>
                                <div className="text-xs text-pink-900/60">Followers</div>
                            </div>
                        </div>
                        <h4 className="text-md font-semibold text-pink-900 mt-5">Fun Facts</h4>
                        <ul className="mt-3 list-disc list-inside text-sm text-pink-900/70 space-y-2">
                            <li>Loves hiking and long drives.</li>
                            <li>Has visited 12 national parks.</li>
                            <li>Usually brings snacks for the ride.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};

