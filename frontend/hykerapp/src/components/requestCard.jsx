import { useNavigate } from "react-router-dom";

export default function RequestCard({ request }) {
  const {
    name,
    initials,
    from,
    to,
    pickupLocation,
    dropoffLocation,
  } = request;

  const navigate = useNavigate();

  const handleOfferRide = () => {
    // Safety check so it doesn't crash if a request is missing coords
    if (!pickupLocation || !dropoffLocation) {
      alert("This request doesn't have full coordinates yet.");
      return;
    }

    navigate("/ride", {
      state: {
        riderId: 1, // you can later replace with real logged-in user id
        pickupLat: pickupLocation.lat,
        pickupLong: pickupLocation.lng,
        dropLat: dropoffLocation.lat,
        dropLong: dropoffLocation.lng,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 px-5 py-4 flex items-center justify-between gap-4 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-sm font-semibold text-[#58062F]">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#58062F]">{name}</p>
        </div>
      </div>

      <div className="flex-1 min-w-[180px]">
        <p className="text-sm font-medium text-[#2b1020]">
          {from}, {to}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleOfferRide}
          className="px-4 py-1.5 rounded-full bg-[#ff3ba7] text-white text-xs font-semibold shadow-sm hover:bg-[#ff5fb6] active:scale-[0.97] transition"
        >
          Offer Ride
        </button>
      </div>
    </div>
  );
}
