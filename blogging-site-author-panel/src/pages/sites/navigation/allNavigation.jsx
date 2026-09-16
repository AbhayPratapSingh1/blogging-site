import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNavigationRequest } from "../../../features/navigationSlice";
import { useParams, Link } from "react-router-dom";
import Table from "../../../Components/table/Table";
import { NavigationHeaders } from "../../../Components/table/tabledata";
import { MdOutlineAddBox } from "react-icons/md";

export default function AllNavigation() {
    const navData = useSelector(store => store.navigation.allNavigations)
    const dispatch = useDispatch()
    const { siteId } = useParams()

    useEffect(() => {
        dispatch(getAllNavigationRequest(siteId))
    }, [dispatch, siteId])

    return (
        <div className='px-6 py-4 bg-gray-100 min-h-screen'>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
                    <p className="text-sm text-gray-500">{navData?.length || 0} navigation items</p>
                </div>
                <Link 
                    to={`/sites/${siteId}/navigation/add-new`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <MdOutlineAddBox className="text-lg" />
                    <span className="font-medium">Add New</span>
                </Link>
            </div>

            <Table 
                header={NavigationHeaders} 
                streamData={navData} 
                editLink={`/sites/${siteId}/navigation/update-navigation`} 
                DeleteLink={`/sites/${siteId}/navigation/delete`} 
            />
        </div>
    )
}
