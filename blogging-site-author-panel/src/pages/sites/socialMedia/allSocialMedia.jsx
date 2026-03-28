import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Table from "../../../Components/table/Table";
import { getAllSocialMediaRequest } from "../../../features/socialMediaSlice";
import { SocialMediaHeaders } from "../../../Components/table/tabledata";
import AddNew from "../../../Components/common/addNew";


export default function AllSocialMedia() {

    const socialMediaData = useSelector(store => store.socialMedia.allSocialMedias)
    console.log("spcialMedia : ", socialMediaData);
    const dispatch = useDispatch()
    const { siteId } = useParams()

    useEffect(() => {
        dispatch(getAllSocialMediaRequest(siteId))
    }, [dispatch, siteId])

    const ActionDiv = {
        name: "Add",
        link: `/sites/${siteId}/social-media/add-new`
    }

    return (
        <div className='p-10 bg-gray-100 h-full flex' >
                <Table header={SocialMediaHeaders} streamData={socialMediaData} ActionDiv={ActionDiv} editLink={`/sites/${siteId}/social-media/update-social-media`} DeleteLink={`/sites/${siteId}/social-media/delete`} />
                <div className=" w-[20rem] ">
                    <AddNew link={`/sites/${siteId}/social-media/add-new`} />
                </div>
            
        </div>
    )

}