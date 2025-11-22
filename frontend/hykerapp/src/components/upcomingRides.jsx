const upcomingRide = {
    date: "Dec 17",
    time: "8:45 AM",
    from: "Student Center East",
    to: "Union Station",
    driver: "Olivia"
}

const pastRides = [
    {
        id: 1,
        date: "Nov 13",
        from: "Union Station",
        to: "Student Center East",
        driver: "Jacob",
    },
    {
        id: 2,
        date: "Sep 21",
        from: "123 Naperville Dr",
        to: "453 Aurora Dr",
        driver: "Susan",
    },
    {
        id: 3,
        date: "Nov 01",
        from: "Bawarchi, Aurora",
        to: "Chicago",
        driver: "Kate",
    }
];

export default function upcomingRides(){
    return(
        <div className="w-[520px] bg-white/95 rounded-3xl shadow-2xl border border-white/70 px-8 py-7 flex flex-col gap-6">
            <section>
                <h2>
                    Upcoming Ride
                </h2>
                <div className="rounded-2xl bg-pink-50 px-4 py-3 flex items-start justify-between gap-3 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold text-[#58062F]">
                            {upcomingRide.date}, {upcomingRide.time}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                            {upcomingRide.from}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {upcomingRide.to}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-xs font-semibold text-[#58062F]">
                            {upcomingRide.driver[0]}
                        </div>
                        <p className="text-xs text-gray-500">
                            Driver
                        </p>
                        <p className="text-sm font-medium text-[#58062F]">
                            {upcomingRide.driver}
                        </p>
                    </div>
                </div>
            </section>

            <hr className = "border-pink-100"/>
            <section>
                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                    Recent Rides
                </h3>
                <div className="flex flex-col gap-2">
                    {pastRides.map((ride) => (
                        <button
                            key = {ride.id}
                            className = "w-full text-left rounded-2xl px-4 py-3 bg-white hover:bg-pink-50 transition shadow-sm hover:shadow-md flex items-center justify-between gap-3 cursor-pointer"
                        >
                            <div>
                                <p className="text-xs font-semibold text-gray-500">
                                {ride.date}
                                </p>
                                <p className="text-sm text-gray-900 mt-0.5">{ride.from}</p>
                                <p className="text-xs text-gray-500 mt-0.5">→ {ride.to}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <p className="text-xs text-gray-500">Driver</p>
                                <p className="text-sm font-medium text-[#58062F]">
                                {ride.driver}
                                </p>
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-pink-100 text-[11px] font-semibold text-[#58062F]">
                                {ride.price}
                                </span> 
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}