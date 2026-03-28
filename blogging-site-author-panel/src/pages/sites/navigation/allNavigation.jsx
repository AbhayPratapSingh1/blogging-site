import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNavigationRequest } from "../../../features/navigationSlice";
import { useParams } from "react-router-dom";
import Table from "../../../Components/table/Table";
import { NavigationHeaders } from "../../../Components/table/tabledata";
import AddNew from "../../../Components/common/addNew";


export default function AllNavigation() {
    const navData = useSelector(store => store.navigation.allNavigations)
    const dispatch = useDispatch()
    const { siteId } = useParams()

    useEffect(() => {
        dispatch(getAllNavigationRequest(siteId))
    }, [dispatch])

    const ActionDiv = {
        name: "Add",
        link: `/sites/${siteId}/navigation/add-new`
    }
    return (
        <div className='p-10 bg-gray-100 h-full' >
            <div className="flex">
                <Table header={NavigationHeaders} streamData={navData} ActionDiv={ActionDiv} editLink={`/sites/${siteId}/navigation/update-navigation`} DeleteLink={`/sites/${siteId}/navigation/delete`} />
                <div className=" w-[20rem] ">
                    <AddNew link={`/sites/${siteId}/navigation/add-new`} />
                </div>
            </div>
        </div>
    )

}