import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleTableMenu } from "../../features/appSlice";

export default function Table({ header, streamData, ActionDiv, editLink, DeleteLink, lastRowRef }) {
    const dispatch = useDispatch()
    const tableMenu = useSelector(state => state.app.tableMenu)
    const [selected, setSelected] = useState([])

    const isEntryCheck = (id) => selected && selected.length > 0 && selected.find(one => one._id === id)
    const isAllSelected = () => selected && filterPost && selected.length === filterPost.length

    const toggleSelectAll = () => {
        if (selected && filterPost && selected.length === filterPost.length) {
            setSelected([]);
        } else {
            setSelected(filterPost || []);
        }
    }

    const toggleSelect = (one) => {
        if (isEntryCheck(one._id)) {
            setSelected(selected.filter(each => each._id !== one._id))
        } else {
            setSelected([...selected, one])
        }
    }

    const filterPost = streamData

    return (
        <section>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-10 px-4 py-3 text-left">
                                <input 
                                    onChange={() => {}} 
                                    onClick={toggleSelectAll} 
                                    checked={isAllSelected()} 
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    type="checkbox" 
                                />
                            </th>
                            {header && header.length > 0 && header.map((each, index) => (
                                <th 
                                    key={index} 
                                    className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 ${
                                        index === 0 ? "min-w-[300px]" : ""
                                    }`}
                                >
                                    {each.headerName}
                                </th>
                            ))}
                            <th className="w-12 px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filterPost && filterPost.length > 0 && filterPost.map((item, index) => {
                            const isLast = index === filterPost.length - 1
                            return (
                                <tr 
                                    ref={isLast ? lastRowRef : null} 
                                    key={item._id || index} 
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <input 
                                            onChange={() => {}} 
                                            onClick={() => toggleSelect(item)} 
                                            checked={isEntryCheck(item._id)} 
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                            type="checkbox" 
                                        />
                                    </td>
                                    {header && header.length > 0 && header.map((each, hIndex) => {
                                        const { accesserId, formatFunction, type } = each
                                        if (type === "boolean") {
                                            return (
                                                <td key={hIndex} className="px-4 py-3 text-sm text-gray-600">
                                                    {item[accesserId] ? "YES" : "NO"}
                                                </td>
                                            )
                                        }
                                        return (
                                            <td key={hIndex} className={`px-4 py-3 text-sm ${
                                                hIndex === 0 ? "text-gray-800 font-medium" : "text-gray-600"
                                            }`}>
                                                {formatFunction ? formatFunction(item[accesserId]) : (item[accesserId] || "-")}
                                            </td>
                                        )
                                    })}
                                    <td className="px-4 py-3">
                                        <div className="relative">
                                            <button 
                                                onClick={() => dispatch(toggleTableMenu(index))} 
                                                className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <BsThreeDots />
                                            </button>
                                            {index === tableMenu && (
                                                <div className="absolute z-50 right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                                                    <div className="py-1">
                                                        <Link 
                                                            to={`${editLink}/${item._id}`} 
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link 
                                                            to={`${DeleteLink}/${item._id}`} 
                                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filterPost && filterPost.length === 0 && (
                            <tr>
                                <td colSpan={header?.length + 2} className="px-4 py-8 text-center text-gray-400">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
