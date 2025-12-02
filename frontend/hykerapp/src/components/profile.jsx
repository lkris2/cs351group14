import {useState, useContext, useRef, useEffect } from "react";
import Navbar from "./navbar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SignUp from "./signup.jsx";
import { AuthContext } from "../Authcontext.jsx";

export default function Profile() {
    const { isLoggedIn } = useContext(AuthContext);
    const imageModules = import.meta.glob('../assets/person*.png', { eager: true, as: 'url' });
    const imageList = Object.values(imageModules || {});
    const [selectedImage, setSelectedImage] = useState(imageList[0] || '');
    const [pickerOpen, setPickerOpen] = useState(false);
    const fileInputRef = useRef(null);

    const [user, setUser] = useState({
        name: "New User",
        username: '',
        email: '',
        rating: null,
        followers: 0,
        trips: []
    });
    const rides = user.trips.length;
    const [addingTrip, setAddingTrip] = useState(false);
    const [newTrip, setNewTrip] = useState({ date: '', from: '', to: '', notes: '' });
    const [editingProfile, setEditingProfile] = useState(false);
    const [editFields, setEditFields] = useState({ name: user.name, username: user.username, email: user.email });

    function handleFileChange(e) {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setSelectedImage(url);
        try { sessionStorage.setItem('profileAvatar', url); } catch (err) { /* ignore */ }
        window.dispatchEvent(new Event('profileAvatarChanged'));
        setPickerOpen(false);
    }

    // Ensure the currently selected image (including initial bundled avatar)
    // is synced to sessionStorage so the navbar can show the face immediately.
    useEffect(() => {
        if (!selectedImage) return;
        try { sessionStorage.setItem('profileAvatar', selectedImage); } catch (err) { /* ignore */ }
        window.dispatchEvent(new Event('profileAvatarChanged'));
    }, [selectedImage]);

    // Load persisted trips from sessionStorage on mount and listen for updates
    useEffect(() => {
        const loadTrips = () => {
            try {
                const uid = sessionStorage.getItem('userId') || 'anon';
                const key = `profileTrips:${uid}`;
                const raw = sessionStorage.getItem(key) || sessionStorage.getItem('profileTrips');
                if (!raw) return;
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) setUser(prev => ({ ...prev, trips: arr }));
            } catch (err) {
                console.warn('Failed to load profileTrips', err);
            }
        };

        loadTrips();
        window.addEventListener('tripsUpdated', loadTrips);
        return () => window.removeEventListener('tripsUpdated', loadTrips);
    }, []);

    // Ensure profile name/username are populated when the user is logged in.
    // Priority: sessionStorage.profileName (from login/signup). If missing,
    // generate a friendly name and username (persisted to sessionStorage so it
    // survives navigation within the session).
    useEffect(() => {
        if (!isLoggedIn) return;

    let profileName = null;
    let profileEmail = null;
    // Prefer namespaced keys per-user to avoid cross-user collisions
    let userIdKey = null;
    try { userIdKey = sessionStorage.getItem('userId'); } catch (err) { userIdKey = null; }
    const nameKey = userIdKey ? `profileName:${userIdKey}` : 'profileName';
    const emailKey = userIdKey ? `profileEmail:${userIdKey}` : 'profileEmail';
    const usernameKey = userIdKey ? `profileUsername:${userIdKey}` : 'profileUsername';
    try { profileName = sessionStorage.getItem(nameKey) || sessionStorage.getItem('profileName'); } catch (err) { profileName = null; }
    try { profileEmail = sessionStorage.getItem(emailKey) || sessionStorage.getItem('profileEmail'); } catch (err) { profileEmail = null; }

        // helper to create a username base
        const makeUsername = (nameBase) => {
            const base = (nameBase.split(' ')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
            const rand = Math.floor(1000 + Math.random() * 9000);
            return `${base}${rand}`;
        };

    // if we already have a persisted username, use it
    let persistedUsername = null;
    try { persistedUsername = sessionStorage.getItem(usernameKey) || sessionStorage.getItem('profileUsername'); } catch (err) { persistedUsername = null; }

        if (profileName) {
            // use the provided profileName and ensure a username exists
            const usernameToUse = persistedUsername || makeUsername(profileName);
            try { sessionStorage.setItem(usernameKey, usernameToUse); sessionStorage.setItem(nameKey, profileName); } catch (err) {}
            setUser(prev => ({ ...prev, name: profileName, username: usernameToUse }));
            return;
        }

            // If profileName isn't available but we have an email, derive from it
            if (!profileName && profileEmail) {
                const local = (profileEmail.split('@')[0] || '').replace(/[^a-zA-Z0-9._-]/g, '');
                if (local) {
                    const displayName = local.toUpperCase();
                    const usernameToUse = persistedUsername || local;
                    try { sessionStorage.setItem('profileName', displayName); sessionStorage.setItem('profileUsername', usernameToUse); } catch (err) {}
                    setUser(prev => ({ ...prev, name: displayName, username: usernameToUse, email: profileEmail }));
                    return;
                }
            }

        // If no profileName, try to derive something from a stored userId
        let userId = null;
        try { userId = sessionStorage.getItem('userId'); } catch (err) { userId = null; }

        if (!persistedUsername) {
            // generate display name and username
            let generatedName = null;
            if (userId) {
                const tail = userId.slice(-4);
                generatedName = `User ${tail}`;
            } else {
                const rnd = Math.floor(1000 + Math.random() * 9000);
                generatedName = `User ${rnd}`;
            }
            const usernameToUse = makeUsername(generatedName);
            try { sessionStorage.setItem(nameKey, generatedName); sessionStorage.setItem(usernameKey, usernameToUse); } catch (err) {}
            setUser(prev => ({ ...prev, name: generatedName, username: usernameToUse }));
            return;
        }

        // If we reach here, we had a persisted username but no profileName
        // (unlikely) — create a display name from the username base.
        const display = persistedUsername.replace(/\d+$/, '');
        const finalName = display ? display.charAt(0).toUpperCase() + display.slice(1) : 'User';
        try { sessionStorage.setItem(nameKey, finalName); } catch (err) {}
        setUser(prev => ({ ...prev, name: finalName, username: persistedUsername }));
    }, [isLoggedIn]);

    function handleAddTripSubmit(e) {
        e.preventDefault();
        const trip = { ...newTrip, id: Date.now() };
        setUser(prev => {
            const updatedTrips = [trip, ...prev.trips];
            const updated = { ...prev, trips: updatedTrips };
            try {
                const uid = sessionStorage.getItem('userId') || 'anon';
                const key = `profileTrips:${uid}`;
                sessionStorage.setItem(key, JSON.stringify(updatedTrips));
                window.dispatchEvent(new Event('tripsUpdated'));
            } catch (err) {}
            return updated;
        });
        setNewTrip({ date: '', from: '', to: '', notes: '' });
        setAddingTrip(false);
    }

    function handleDeleteTrip(id) {
        setUser(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id) }));
    }

    function handleStartEdit() {
        setEditFields({ name: user.name, username: user.username, email: user.email });
        setEditingProfile(true);
    }

    function handleCancelEdit() {
        setEditingProfile(false);
    }

    function handleSaveProfile(e) {
        e.preventDefault();
        setUser(prev => ({ ...prev, name: editFields.name, username: editFields.username, email: editFields.email }));
        setEditingProfile(false);
    }


    return(
        <div className="min-h-screen bg-gradient-to-br from-[#4b0226] via-[#7b1742] to-[#f9f2e8] flex flex-col">
            <Navbar/>
            <div className="flex-1 flex items-center justify-center py-6 md:py-12">
                <div className="w-full max-w-5xl mx-auto px-4">
                    <div className="bg-[#f9f2e8] rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-center min-h-[420px]">
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
                                            <button key={i} onClick={() => { setSelectedImage(url); try { sessionStorage.setItem('profileAvatar', url); } catch (err) {} window.dispatchEvent(new Event('profileAvatarChanged')); setPickerOpen(false); }} className="rounded overflow-hidden w-12 h-12">
                                                <img src={url} className="w-12 h-12 object-cover" alt={`person-${i}`} />
                                            </button>
                                        )) : (
                                            <div className="text-xs text-gray-500">No bundled avatars</div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-sm px-3 py-1 bg-pink-700 text-white rounded">Upload</button>
                                        <button onClick={() => { const v = imageList[0] || ''; setSelectedImage(v); try { sessionStorage.setItem('profileAvatar', v); } catch (err) {} window.dispatchEvent(new Event('profileAvatarChanged')); setPickerOpen(false); }} className="text-sm px-3 py-1 border rounded">Reset</button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-4 w-full">
                            {!editingProfile ? (
                                <>
                                    <p className="text-md tracking-[0.25em] uppercase text-pink-900/70 mb-0">{user.name}</p>
                                    <p className="text-sm text-gray-600">@{user.username || 'username'}</p>
                                    <div className="mt-3">
                                        <button onClick={handleStartEdit} className="px-3 py-1 bg-pink-700 text-white rounded text-sm">Edit Profile</button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSaveProfile} className="flex flex-col gap-2 items-center">
                                    <input value={editFields.name} onChange={e => setEditFields(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="p-2 rounded border w-56 text-sm" />
                                    <input value={editFields.username} onChange={e => setEditFields(prev => ({ ...prev, username: e.target.value }))} placeholder="Username" className="p-2 rounded border w-56 text-sm" />
                                    <input value={editFields.email} onChange={e => setEditFields(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" className="p-2 rounded border w-56 text-sm" />
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="px-3 py-1 bg-pink-700 text-white rounded text-sm">Save</button>
                                        <button type="button" onClick={handleCancelEdit} className="px-3 py-1 border rounded text-sm">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-pink-900">Profile Summary</h3>
                        <p className="text-sm text-pink-900/70 mt-2">Short bio or summary goes here. You can show recent rides, preferences, or quick links.</p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-pink-700">{rides}</div>
                                <div className="text-xs text-pink-900/60">Rides</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-pink-700">{user.rating ?? '—'}</div>
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
                                {user.trips.length === 0 ? (
                                    <div className="text-sm text-gray-500">You don't have any trips yet — add your first trip with the "Add Trip" button.</div>
                                ) : (
                                    user.trips.map(trip => (
                                        <div key={trip.id} className="flex items-start justify-between bg-white/60 p-3 rounded-lg">
                                            <div>
                                                <div className="text-sm font-medium text-pink-900">{trip.date} — {trip.from} → {trip.to}</div>
                                                {trip.notes && <div className="text-xs text-pink-900/70">{trip.notes}</div>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleDeleteTrip(trip.id)} className="text-xs text-red-600">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

