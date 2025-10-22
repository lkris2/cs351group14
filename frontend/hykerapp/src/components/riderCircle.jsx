export default function riderCircle({ drivername, numMiles }) {
    return (
        <div className="flex flex-col items-center bg-[#68224B] rounded-full p-3 hover:bg-[#7e3061] transition">
            <p className = "font-medium">{drivername}</p>
            <p className = "text-sm text-gray-300">{numMiles}</p>
        </div>
    )
}