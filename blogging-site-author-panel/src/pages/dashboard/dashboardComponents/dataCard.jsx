const DataCard = ({name, value, icon})=>{
    return(
        <div className="bg-white relative border rounded-3xl shadow-2xl">
            <div className="absolute -top-7 left-5 text-5xl text-gray-600 -rotate-6 ">{icon}</div>
            <div className="border w-36 h-24 rounded-3xl flex flex-col p-4">
                <div className="flex-grow"/>
                <p className="text-[12px] text-gray-700">{name}</p>
                <p className="text-md text-gray-800">{value}</p>
            </div>
        </div>
    )
}

export default DataCard