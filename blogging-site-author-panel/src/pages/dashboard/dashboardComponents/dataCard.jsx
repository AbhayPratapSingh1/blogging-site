const DataCard = ({name, value, icon})=>{
    return(
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className="text-blue-600 text-2xl">{icon}</div>
                <div>
                    <p className="text-sm text-gray-500">{name}</p>
                    <p className="text-2xl font-semibold text-gray-800">{value || 0}</p>
                </div>
            </div>
        </div>
    )
}

export default DataCard
