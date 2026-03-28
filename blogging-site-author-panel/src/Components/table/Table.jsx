import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleTableMenu } from "../../features/appSlice";

export default function ({ header, streamData, ActionDiv, editLink, DeleteLink }) {
    const dispatch = useDispatch()
    const tableMenu = useSelector(state => state.app.tableMenu)
    const [selected, setSelected] = useState([])

    const isEntryCheck = (id) => selected && selected.length > 0 && selected.find(one => one._id === id)
    const isAllSelected = () => selected && filterPost && selected.length == filterPost.length

    const toggleSelectAll = () => {
        if (selected && filterPost && selected.length == filterPost.length) {
            setSelected([]);
        }
        else if (selected.length > 0) {
            setSelected(filterPost);
        }
        else if (selected.length == 0) {
            setSelected(filterPost);
        }
    }
    const toggleSelect = (one) => {
        if (isEntryCheck(one._id)) {
            setSelected(selected.filter(each => each._id != one._id))
        }
        else {
            setSelected([...selected, one])
        }
    }
    const filterPost = streamData

    console.log("table ", tableMenu);
    return (
        <section>

            <div className=" rounded-xl">
                <table onClick={()=>{toggleTableMenu(-1)}} className=" table-fixed w-auto">
                    <thead className="border-b border-gray-200 text-sm text-gray-400 font-thin">
                        <tr>
                            <th className=" w-10 text-left pt-1.5">
                                <input onChange={() => { }} onClick={toggleSelectAll} checked={isAllSelected()} className="w-4 h-4 rounded border-gray-200 border bg-gray-300 text-left" type="checkbox" name="none" id="" />
                            </th>
                            {header && header.length > 0 && header.map((each, index) => {
                                return (
                                    <th key={index} className={` text-left text-gray-400 font-semibold ${index === 0 ? "w-96" : (index === header.length - 1 ? "" : "w-32")}`}><button>{each.headerName}</button></th>
                                )
                            })}
                            <th className="text-center w-3"></th>
                        </tr>

                    </thead>
                    <tbody>
                        {filterPost && filterPost.length > 0 && filterPost.map((navigation, index) => {
                            return (
                                <tr key={index} className="border-b h-10 border-gray-200 text-gray-600 text-sm">
                                    <td onClick={() => { toggleSelect(navigation) }} className="text-left"><input onChange={()=>{}} checked={isEntryCheck(navigation._id)} className="w-4 h-4 rounded border-black border text-center" type="checkbox" name="" id="" /></td>
                                    {header && header.length > 0 && header.map((each, index) => {
                                        const { accesserId, formatFunction, type } = each
                                        if (type === "boolean") {
                                            return <td key={index} className="text-left text-gray-400">{navigation[accesserId] ? "YES" : "NO"}</td>
                                        }
                                        return (
                                            <td key={index} className={`text-left ${index === 0 ? "text-gray-600" : (index === header.length - 1 ? "text-gray-500" : "text-gray-400")}`}>{formatFunction ? formatFunction(navigation[accesserId]) : navigation[accesserId]}</td>
                                        )
                                    })}
                                    <td className="relative w-12 h-full text-right">
                                        <button onClick={() => { dispatch(toggleTableMenu(index)) }}><div className="text-right w-full h-full rotate-90 text-gray-400"> <BsThreeDots /></div></button>
                                        {index === tableMenu && <div onBlur={()=>{toggleTableMenu(-1)}} className="absolute z-50 border border-gray-400 -top-1 left-5 bg-gray-50 shadow-md rounded-md">
                                            <div className="flex flex-col items-start p-1 px-5">
                                                <Link to={`${editLink}/${navigation._id}`}> <div className=" border-gray-500 ">Edit</div></Link>
                                                <Link to={`${DeleteLink}/${navigation._id}`}><div className=" border-gray-500 ">Delete</div></Link>
                                            </div>
                                        </div>}

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
