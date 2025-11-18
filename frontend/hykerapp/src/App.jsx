import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import LoginPage from "./components/loginPage";
import AboutPage from "./components/about";
import RequestRides from "./RequestRides";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/RidePage" element={<FindRidePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/requests" element={<RequestRides/>}/>

      </Routes>
    </Router>
  );
}
