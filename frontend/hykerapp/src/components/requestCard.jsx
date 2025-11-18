export default function requestCard({request}){
    const{
        name,
        initials,
        from,
        to,
        time,
        note,
        gasPriceShare,
        pickupLocation
    } = request

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
                <p className="text-xs text-gray-500 mt-1">
                    {time}
                    {note ? ` · ${note}` : ""}
                </p>
            </div>
            <div className="flex flex-col items-end gap-2">
                {gasPriceShare && (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-pink-50 text-[11px] font-semibold text-[#58062F]">
                        {gasPriceShare}
                    </span>
                )}
                <button
                    type = "button"
                    className="px-4 py-1.5 rounded-full bg-[#ff3ba7] text-white text-xs font-semibold shadow-sm hover:bg-[#ff5fb6] active:scale-[0.97] transition"
                >
                    Offer Ride
                </button>
            </div>
        </div>

    );
}