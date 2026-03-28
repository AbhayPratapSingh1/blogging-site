const Friends = ({ authors }) => {
    return (
        <div className="rounded-xl shadow-xl bg-white w-full p-4 py-2 m-2 ">
            <h2 className="text-gray-700 font-semibold text-lg my-2"> Friend Authors</h2>
            <div className="flex gap-2 flex-wrap">
                {authors && authors.length > 0 && authors.map((each, index) => {
                    return (
                        <div key={index} className="flex flex-col justify-center items-center mx-1">
                            <div className="h-10 w-10 overflow-hidden rounded-full "><img src={each?.profilePic?.url} alt='user' /></div>
                            <div className="text-sm">{each.name.split(" ")[0]}</div>
                        </div>
                    )
                })}
                <div className="flex flex-col justify-center items-center">
                    <div className="h-7 w-7 rounded-full bg-yellow-500 text-3xl font-bold flex justify-center items-center">+</div>
                    <div className="text-sm">Add more</div>
                </div>
            </div>
        </div>
    )
}

export default Friends