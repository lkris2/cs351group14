import Navbar from "./components/navbar";
import HykerForm from "./components/hykerForm";
import FindRideMap from "./components/FindRideMap";   // 👈 add this

export default function FindRidePage({ addRequest }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fbe4e8] flex flex-col">
      <Navbar />
      <main className="flex-1 flex px-10 py-10">
        {/* LEFT FORM */}
        <div className="w-[380px] mr-10">
          <HykerForm addRequest={addRequest} />
        </div>

        {/* RIGHT POPULAR DESTINATIONS MAP */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[85vh] w-full">
            <FindRideMap />
          </div>
        </div>
      </main>
    </div>
  );
}
