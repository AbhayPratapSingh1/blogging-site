const StorageStatus = ({color, icon, total, present, description})=>{
    const width = total > 0 ? Math.floor(Number(present / total * 100)) : 0
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500'
    }
    
    return (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600`}>
                {icon}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{description}</span>
                    <span className="text-sm text-gray-500">{present}/{total}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${colorClasses[color] || 'bg-gray-500'} rounded-full transition-all duration-300`}
                        style={{width: `${width}%`}}
                    />
                </div>
            </div>
        </div>
    )
}

export default StorageStatus
