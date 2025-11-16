import Navbar from "./components/navbar";
import HykerForm from "./components/hykerForm";
import Map from "./components/map";

export default function FindRidePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 p-6 gap-6">
        <div className="w-[30%] flex justify-center items-start">
          <HykerForm />
        </div>
        <div className="w-[70%] flex justify-center items-center">
          <Map />
        </div>
      </div>
    </div>
  );
}