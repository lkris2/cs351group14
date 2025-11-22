import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import RidePage from "./RidePage";
import 'leaflet/dist/leaflet.css';
import LoginPage from "./components/loginPage";
import AboutPage from "./components/about";
import SignUp from "./components/signup";

import { useEffect, useState } from "react";
import RequestRides from "./RequestRides";
import RideConfirmation from "./components/rideConfirmation";

export default function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/RidePage" element={<FindRidePage />} />
        <Route path="/ride" element={<RidePage/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/requests" element={<RequestRides/>}/>
        <Route path="/ride-confirmation" element={<RideConfirmation/>}/>

      </Routes>
    </Router>
  );
}
