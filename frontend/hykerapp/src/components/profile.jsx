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

    // user state (replace with real data from AuthContext/API later)
    const [user, setUser] = useState({
        name: "USER'S NAME",
        username: 'username',
        email: 'user.email@example.com',
        rating: 4.9,
        followers: 34,
        trips: [
            { id: 1, date: '2025-11-01', from: 'Downtown', to: 'Uptown', notes: 'Morning commute' },
            { id: 2, date: '2025-10-21', from: 'Home', to: 'Airport', notes: 'Airport drop-off' }
        ]
    });
    // rides count derived from trips
    const rides = user.trips.length;
    const [addingTrip, setAddingTrip] = useState(false);
    const [newTrip, setNewTrip] = useState({ date: '', from: '', to: '', notes: '' });

    function handleFileChange(e) {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setSelectedImage(url);
        setPickerOpen(false);
    }

    function handleAddTripSubmit(e) {
        e.preventDefault();
        const trip = { ...newTrip, id: Date.now() };
        setUser(prev => ({ ...prev, trips: [trip, ...prev.trips] }));
        setNewTrip({ date: '', from: '', to: '', notes: '' });
        setAddingTrip(false);
        // TODO: persist to backend via API
    }

    function handleDeleteTrip(id) {
        setUser(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id) }));
        // TODO: persist deletion to backend
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
                                <div className="text-2xl font-bold text-pink-700">{rides}</div>
                                <div className="text-xs text-pink-900/60">Rides</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-700">{user.rating}</div>
                                <div className="text-xs text-pink-900/60">Rating</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-700">{user.followers}</div>
                                <div className="text-xs text-pink-900/60">Followers</div>
                            </div>
                        </div>
                        <h4 className="text-md font-semibold text-pink-900 mt-5">Fun Facts</h4>
                        <ul className="mt-3 list-disc list-inside text-sm text-pink-900/70 space-y-2">
                            <li>Loves hiking and long drives.</li>
                            <li>Has visited 12 national parks.</li>
                            <li>Usually brings snacks for the ride.</li>
                        </ul>

                        {/* Past trips */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-md font-semibold text-pink-900">Past Trips</h4>
                                <button onClick={() => setAddingTrip(v => !v)} className="text-sm px-3 py-1 bg-pink-700 text-white rounded">{addingTrip ? 'Cancel' : 'Add Trip'}</button>
                            </div>

                            {addingTrip && (
                                <form onSubmit={handleAddTripSubmit} className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input required value={newTrip.date} onChange={e => setNewTrip(prev => ({ ...prev, date: e.target.value }))} type="date" className="p-2 rounded border" />
                                    <input required value={newTrip.from} onChange={e => setNewTrip(prev => ({ ...prev, from: e.target.value }))} placeholder="From" className="p-2 rounded border" />
                                    <input required value={newTrip.to} onChange={e => setNewTrip(prev => ({ ...prev, to: e.target.value }))} placeholder="To" className="p-2 rounded border" />
                                    <input value={newTrip.notes} onChange={e => setNewTrip(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" className="p-2 rounded border" />
                                    <button type="submit" className="col-span-full md:col-auto px-4 py-2 bg-pink-700 text-white rounded">Save Trip</button>
                                </form>
                            )}

                            <div className="mt-4 grid gap-3">
                                {user.trips.length === 0 && <div className="text-sm text-gray-500">No past trips</div>}
                                {user.trips.map(trip => (
                                    <div key={trip.id} className="flex items-start justify-between bg-white/60 p-3 rounded-lg">
                                        <div>
                                            <div className="text-sm font-medium text-pink-900">{trip.date} — {trip.from} → {trip.to}</div>
                                            {trip.notes && <div className="text-xs text-pink-900/70">{trip.notes}</div>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteTrip(trip.id)} className="text-xs text-red-600">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

