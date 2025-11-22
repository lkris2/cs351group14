import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import RidePage from "./RidePage";
import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/RidePage" element={<FindRidePage />} />
        <Route path="/ride" element={<RidePage/>} />
      </Routes>
    </Router>
  );
}
