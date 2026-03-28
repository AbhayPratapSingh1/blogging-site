import { useState } from "react"
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { toggleMultiSelectMenu } from "../../features/appSlice";

const Select = ({setFieldValue, selected, setSelected, options}) => {
    const [filterText, setFilterText] = useState("")
    const multiSelect = useSelector(store => store.app.multiSelectMenu)
    const dispatch = useDispatch()
    const toggleItem = (name) => {
        if (selected.includes(name)) {
            const temp = selected.filter(one => one != name )
            setSelected(temp)
            setFieldValue && setFieldValue(temp)
        }
        else {
            const temp = [...selected, name]
            setSelected(temp)
            setFieldValue && setFieldValue(temp)
        }
        dispatch(toggleMultiSelectMenu(false))
    }
    const selectingList = options.filter(one=>one.toUpperCase().startsWith(filterText.toUpperCase()))

    return (
            <div className="w-40">
                <div className=" relative w-full h-auto border border-gray-300 rounded-sm p-2 text-gray-700 focus:border-green-500">
                    <div className="flex flex-wrap gap-2">
                        {selected.map((each, index)=>{
                            return (
                                <div key={index} className=" border rounded-md px-2 py-0.5 text-sm">{each} <span onClick={()=>{toggleItem(each)}} className="text-sm ps-2 py-0.5 text-[10px] cursor-pointer">X</span> </div>
                            )
                        })}
                        <input value={filterText} onChange={(e)=>{setFilterText(e.target.value)}} onClick={() => { dispatch(toggleMultiSelectMenu(!multiSelect)) }} className="bg-transparent flex-grow flex-shrink w-7 focus:border-transparent focus:outline-none" type="text" />
                    </div>
                    {multiSelect &&
                        <div className="w-40 absolute bg-white h-auto border border-gray-400 cursor-pointer z-20">
                            {selectingList.map((each, index) => {
                                return (
                                    <div key={index} onClick={() => toggleItem(each)} className={`text-gray-700 px-2 py-0.5 text-sm flex ${selected.includes(each)?" font-semibold":""}`}>{each} <span className="flex-grow"></span>{selected.includes(each)? <TiTick/> : ""}</div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
    )
}

export default Select