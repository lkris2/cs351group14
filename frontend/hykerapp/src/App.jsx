import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import RidePage from "./RidePage";
import 'leaflet/dist/leaflet.css';
import LoginPage from "./components/loginPage";
import AboutPage from "./components/about";
import SignUp from "./components/signup";
import Logout from "./components/logout";

import { useEffect, useState } from "react";
import RequestRides from "./RequestRides";
import RideConfirmation from "./components/rideConfirmation";
import RiderMatchPage from "./components/RideMatchPage";
import Profile from "./components/profile";

  



export default function App() {
  // if(!localStorage.getItem("isLoggedIn")){
  localStorage.setItem("isLoggedIn", false);
  // }
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [requests, setRequests] = useState([]);

  function ProtectedRoute({ children }) {
    return localStorage.getItem("isLoggedIn") === "true" ? children : <Navigate to="/login" />;
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    const getRides = async () => {
      try {
          const res = await fetch("http://127.0.0.1:8000/api/get_rides/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          let data;
          try {
            data = await res.json();
            setRequests(data);
          } catch (parseErr) {
            const text = await res.text();
            console.error(
              "Failed to parse JSON from backend:",
              parseErr,
              "body:",
              text
            );
            return;
          }
      }
      catch (err){
        console.error("Error fetching ride requests:", err);
      }
    };
    getRides();
    const interval = setInterval(getRides, 5000); // then every 5 sec

    return () => clearInterval(interval); // cleanup
  }, []);
    // dynamically puled and updated from the db
  //   const [requests, setRequests] = useState([
  //   {
  //       id:1,
  //       name: "Priya",
  //       initials: "PM",
  //       from: "UIC Campus",
  //       to: "Downtown Chicago",
  //       pickupLocation: { lat: 41.8708, lng: -87.6505 },
  //       dropoffLocation: { lat: 41.8839, lng: -87.6323 },
  //   },
  //   {
  //       id:2,
  //       name: "Alex Morgan",
  //       initials: "AM",
  //       from: "Student Center East",
  //       to: "Union Station",
  //       pickupLocation: { lat: 41.8722, lng: -87.6480 },
  //       dropoffLocation: { lat: 41.8787, lng: -87.6396 },
  //   },
  // ]);
  const addRequest = (newReq) => {
    setRequests(prev => [...prev, newReq]);
  };
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:8000/api/users")
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/"
          element={
            <HomePage />
          }
        />
        <Route
          path="/find-ride"
          element={
            // <ProtectedRoute>
              <FindRidePage addRequest={addRequest} />
            // {/* </ProtectedRoute> */}
          }
        />
        <Route
          path="/ride"
          element={
            // <ProtectedRoute>
              <RidePage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/request-rides"
          element={
              <RequestRides requests={requests} />
          }
        />
        <Route
          path="/ride-confirmation"
          element={
            // <ProtectedRoute>
              <RideConfirmation />
            // </ProtectedRoute>
          }
        />
        <Route path="/ride-match" element={<RiderMatchPage/>} />
        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </Router>
  );
}
