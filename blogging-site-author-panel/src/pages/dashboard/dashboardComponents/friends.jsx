const Friends = ({ authors }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mt-4">
            <h2 className="text-gray-800 font-semibold text-lg mb-4">Authors</h2>
            <div className="flex gap-4 flex-wrap">
                {authors && authors.length > 0 && authors.slice(0, 8).map((each, index) => {
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-gray-200">
                                <img src={each?.profilePic?.url} alt={each.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{each.name.split(" ")[0]}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Friends
