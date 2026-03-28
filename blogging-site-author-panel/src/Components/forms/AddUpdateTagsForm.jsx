import { useFormik, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import * as yup from "yup"
import { setMessage, toggleTableMenu } from '../../features/appSlice'
import { singleSiteRequest } from '../../features/siteSlice'
import NotificationModal from '../modals/NotificationModal'
import { addNewTagsRequest, clearError, singleTagsRequest, updateTagsRequest } from '../../features/tagsSlice'

export default function AddUpdateTagsForm({ edit }) {
    const dispatch = useDispatch()
    const { siteId, tagId } = useParams()
    const fetchedSingleSite = useSelector(state => state.sites.singleSite)
    const successMessage = useSelector((state) => state.app.message)
    const errorMessage = useSelector((state) => state.tags.errorInTags)
    const singleTag = useSelector((state) => state.tags.singleTags)
    const navigate = useNavigate()
    // it will take 3 things => initial values , validationSchema , onSubmitFunction
    const initialValues = {
        tagName: edit ? singleTag?.tagName : ''
    }
    const resetMessage = ({ error }) => {
        dispatch(setMessage(""))
        dispatch(clearError(""))
        { !error && navigate(`/sites/${siteId}/tags`) }
    }

    const validationSchema = yup.object().shape({
        tagName: yup.string().required()
    })
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            if (edit) {
                const dataToSend = {
                    ...values, site: singleTag.site, id: tagId
                }

                dispatch(updateTagsRequest(dataToSend))

                return
            }
            const dataToSend = {
                ...values, site: fetchedSingleSite.site
            }

            dispatch(addNewTagsRequest(dataToSend))
            console.log(dataToSend, "all form values")
        }
    })
    useEffect(() => {
        dispatch(singleSiteRequest(siteId))
    }, [dispatch])

    useEffect(() => {
        if (edit) {
            dispatch(singleTagsRequest(tagId))
        }

    }, [dispatch, edit])

    const {values} = formik
    
    return (
        <div className='bg-gray-100 h-full py-4 px-10' >
            {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetMessage} />}
            {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetMessage} error />}
            <form onSubmit={formik.handleSubmit}>
                <div className="my-4">
                    <label className='my-4 text-right text-sm text-gray-600' htmlFor="tagName">Tag Name : </label>
                    <input onChange={formik.handleChange}
                        value={values.tagName}
                        type="text" id="tagName" className="max-w-96 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Enter Here" required />
                </div>
                <div className="text-center w-96">
                    <button type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
                </div>
            </form>
        </div>
    )
}

