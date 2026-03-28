import { Field, Form, Formik, useFormik, validateYupSchema } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from "yup"
import { setMessage } from '../../features/appSlice'
import { singleSiteRequest } from '../../features/siteSlice'
import NotificationModal from '../modals/NotificationModal'
import { addNewCategoryRequest, clearError, singleCategoryRequest, updateCategoryRequest } from '../../features/categorySlice'

export default function AddUpdateCateegoryForm({ edit }) {
    const dispatch = useDispatch()
    const { siteId, categoryId } = useParams()
    const fetchedSingleSite = useSelector(state => state.sites.singleSite)
    const successMessage = useSelector((state) => state.app.message)
    const errorMessage = useSelector((state) => state.category.errorInCategory)
    const singleCategory = useSelector((state) => state.category.singleCategory)
    const navigate = useNavigate()
    // it will take 3 things => initial values , validationSchema , onSubmitFunction
    const initialValues = {
        categoryName: edit && singleCategory?.categoryName || ''
    }
    const resetMessage = ({ error }) => {
        dispatch(setMessage(""))
        dispatch(clearError())
        { !error && navigate(`/sites/${siteId}/categories`) }
    }

    const validationSchema = yup.object().shape({
        categoryName: yup.string().required()
    })

    const submitFunction = async (values) => {
        console.log("values : ",values);
        if (edit) {
            const dataToSend = {
                ...values, site: singleCategory.site, id: categoryId
            }
            dispatch(updateCategoryRequest(dataToSend))
            return
        }
        const dataToSend = {
            ...values, site: fetchedSingleSite.site
        }

        dispatch(addNewCategoryRequest(dataToSend))
    }
    useEffect(() => {
        dispatch(singleSiteRequest(siteId))
    }, [dispatch, siteId])
    useEffect(() => {
        if (edit) {
            dispatch(singleCategoryRequest(categoryId))

        }
    }, [dispatch, edit])


    return (
        <div className='px-10 bg-gray-100 h-full' >
            {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetMessage} />}
            {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetMessage} error />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitFunction}>
                {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                    
                    <Form>
                        <div className="my-4">
                            <label className='my-4 text-right text-sm text-gray-600' htmlFor="categoryName">Category Name : </label>
                            <Field
                                value={values.categoryName}
                                type="text" name="categoryName" className="max-w-96 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Enter Here" required />
                        </div>
                        <div className="text-center w-96">
                            <button onClick={()=>{console.log("hgelasd");}} type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Submit</button>
                        </div>
                    </Form>

                )}
            </Formik>
        </div>
    )
}

