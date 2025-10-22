import { AiOutlineUser } from "react-icons/ai";
export default function RiderCircle({ drivername, numMiles }) {
    return (
        <div className="flex flex-col items-center bg-[#68224B] rounded-full p-3 hover:bg-[#7e3061] transition">
            <div className="bg-pink-300 w-16 h-16 rounded-full flex items-center justify-center text-2xl">
                {<AiOutlineUser />}
            </div>
            <p className = "font-medium">{drivername}</p>
            <p className = "text-sm text-gray-300">{numMiles}</p>
        </div>
    )
}