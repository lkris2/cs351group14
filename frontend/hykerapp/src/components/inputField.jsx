export default function InputField({ icon, type = "text", placeholder, value, onChange,isSelect = false, options = [] }) {
    let element;
    if (isSelect){
        element = (<select
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none">
            {options.map((opt,i) => (
                <option key={i}>{opt}</option>
            ))}
        </select>
        );
    }else{
        element = (<input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full outline-none bg-transparent"/>
        );
    }
    
    return (
        <div className="flex items-center bg-white text-gray-800 rounded-md px-3 py-2">
            <span className="text-xl mr-2">{icon}</span>
            {element}
        </div>
    );
}