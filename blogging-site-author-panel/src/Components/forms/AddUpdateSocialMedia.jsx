import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup"
import NotificationModal from "../../Components/modals/NotificationModal";
import { setMessage } from "../../features/appSlice";
import { FieldBox } from "../common/fieldBox";
import { singleSiteRequest } from "../../features/siteSlice";
import { addNewSocialMediaRequest, clearError, singleSocialMediaRequest, updateSocialMediaRequest } from "../../features/socialMediaSlice";
import { setSingleNavigation } from "../../features/navigationSlice";
export default function AddUpdateSocialMedia({ edit }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { socialMediaId, siteId } = useParams()

    const singleSocialMedia = useSelector(store => store.socialMedia.singleSocialMedia)
    const singleSite = useSelector(store => store.sites.singleSite)

    const errorMessage = useSelector((state) => state.socialMedia.errorInSocialMedia)
    const successMessage = useSelector((state) => state.app.message)


    const submitFunction = async (value) => {
        const submitValue = { ...value, site: singleSite.site }
        if (edit) {
            const editedValue = { ...submitValue, id: socialMediaId }
            dispatch(updateSocialMediaRequest(editedValue))
            return
        }
        dispatch(addNewSocialMediaRequest(submitValue))
    }

    const initialValues = {
        // this is needed to be correct once checked from the browser
        name: edit ? singleSocialMedia?.name : "",
        link: edit ? singleSocialMedia?.link : "",
    }

    const resetAndNavigate = ({ error }) => {
        dispatch(clearError())
        dispatch(setMessage(""))
        dispatch(setSingleNavigation({}))
        !error && navigate(`/sites/${siteId}/social-media`)
    }

    const validationSchema = yup.object({
        name: yup.string().required("required field"),
        link: yup.string().required("required field"),
    })

    useEffect(() => {
        dispatch(singleSiteRequest(siteId))
        if (edit) {
            dispatch(singleSocialMediaRequest(socialMediaId))
        }
    }, [dispatch, siteId, socialMediaId])
    return (
        <>

            {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetAndNavigate} />}
            {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetAndNavigate} error />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitFunction} >

                {({ values, isSubmitting }) => {
                    return (
                        <Form className="p-10 bg-gray-100 h-full">
                            <FieldBox value={values.name} name="name" label="Social Media Name " />
                            <FieldBox value={values.link} name="link" label="Link " />
                            <div className="text-center w-96 my-4">
                                <button className=" px-4 py-2 rounded bg-blue-700 text-white  disabled:bg-gray-200 " type="submit" >Submit</button>
                            </div>
                        </Form>
                    )

                }}
            </Formik>
        </>
    )
}