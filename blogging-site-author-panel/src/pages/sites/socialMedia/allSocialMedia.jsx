import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Table from "../../../Components/table/Table";
import { getAllSocialMediaRequest } from "../../../features/socialMediaSlice";
import { SocialMediaHeaders } from "../../../Components/table/tabledata";
import { MdOutlineAddBox } from "react-icons/md";

export default function AllSocialMedia() {
    const socialMediaData = useSelector(store => store.socialMedia.allSocialMedias)
    const dispatch = useDispatch()
    const { siteId } = useParams()

    useEffect(() => {
        dispatch(getAllSocialMediaRequest(siteId))
    }, [dispatch, siteId])

    return (
        <div className='px-6 py-4 bg-gray-100 min-h-screen'>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Social Media</h2>
                    <p className="text-sm text-gray-500">{socialMediaData?.length || 0} social links</p>
                </div>
                <Link 
                    to={`/sites/${siteId}/social-media/add-new`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <MdOutlineAddBox className="text-lg" />
                    <span className="font-medium">Add New</span>
                </Link>
            </div>

            <Table 
                header={SocialMediaHeaders} 
                streamData={socialMediaData} 
                editLink={`/sites/${siteId}/social-media/update-social-media`} 
                DeleteLink={`/sites/${siteId}/social-media/delete`} 
            />
        </div>
    )
}
