import Navbar from "./components/navbar";
import HykerForm from "./components/hykerForm";
import UpcomingRides from "./components/upcomingRides";

export default function FindRidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fbe4e8] flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center px-10 py-10">

        <div className="flex w-full max-w-5xl items-start">
       
          <div className="mr-10">
            <HykerForm />
          </div>
          
          <UpcomingRides />
        </div>
      </main>
    </div>
  );
}