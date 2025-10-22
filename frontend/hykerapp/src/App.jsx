import Navbar from "./components/navbar";
import HykerPerson from "./assets/HykerPerson.svg";

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="bg-[#58062F] w-120 h-120 absolute top-1/2 left-4/16 -translate-x-1/2 -translate-y-7/16 rounded-full"></div>
        <div className="bg-[#f9f2e8ff] w-120 h-120 absolute top-9/16 left-6/16 -translate-x-1/2 -translate-y-1/2 rounded-full border-10 border-pink-800">
            <img className="w-110 h-110 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-10 border-pink-800" src={HykerPerson}></img>
      </div>
      <p className="">Hyker</p>
    </div>
  );
}