const StorageStatus = ({color, icon , total, present, desciption})=>{
    const width = total > 0 ? `${Math.floor(Number(present / total * 100))}` : "0"
    return (
        <div className="flex gap-4">
            <div className={`rounded-s bg-gray-200 ${"text-"+color+"-600"} text-2xl h-10 w-10 flex justify-center items-center`}>{icon}</div>
            <div className="flex-grow leading-3 ">
                <div className="w-full h-3 bg-gray-200 rounded-full my-2 relative">
                <div style={{background:color, width:`${width}%`}} className={` absolute top-0 left-0 h-3 z-20 rounded-s-full`}/>
                    {/* <div className={` absolute top-0 left-0 h-3 w-[20%]  ${"bg-"+color+"-500"} z-20 rounded-s-full`}/> */}
                  
                </div>
                <div className="text-sm text-gray-400">{desciption}</div>
            </div>
            <p className="text-gray-400 w-10">{present}/{total}</p>
        </div>
    )
}
export default StorageStatus