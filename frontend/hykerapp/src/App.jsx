import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FindRidePage from "./FindRidePage";
import LoginPage from "./components/loginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/RidePage" element={<FindRidePage />} />
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </Router>
  );
}
