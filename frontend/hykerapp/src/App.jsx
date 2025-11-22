import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import RidePage from "./RidePage";
import 'leaflet/dist/leaflet.css';
import LoginPage from "./components/loginPage";
import AboutPage from "./components/about";
import RequestRides from "./RequestRides";
import RideConfirmation from "./components/rideConfirmation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/RidePage" element={<FindRidePage />} />
        <Route path="/ride" element={<RidePage/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/requests" element={<RequestRides/>}/>
        <Route path="/ride-confirmation" element={<RideConfirmation/>}/>

      </Routes>
    </Router>
  );
}
