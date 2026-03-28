import React, { useEffect, useState } from 'react'
import * as yup from "yup"
import { QuillEditor } from "../editor"
import { Field, Form, Formik } from "formik"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FieldBox } from '../common/fieldBox'
import MultiSelect from '../common/multiSelect'
import { setMessage } from '../../features/appSlice'
import NotificationModal from '../modals/NotificationModal'
import { addNewStaticPagesRequest, clearError, singleStaticPageRequest, updateStaticPagesRequest } from '../../features/staticPagesSlice'
import { getAllTagsRequest } from '../../features/tagsSlice'


const StaticPageValidationSchema = yup.object({
    site: yup.string().required(),
    page: yup.string().required("Page name can't be blank"),
    metaTitle: yup.string().required("Meta Title can't be blank"),
    metaDescription: yup.string().required("Meta Description can't be blank"),
    metaKeywords: yup.string().required("Meta Keywords can't be blank"),
    description: yup.string().required("Description cannot be blank"),
    slug: yup.string(),
});


function AddUpdateStaticPage({ edit }) {
    // create a displch for dispatching thing in the page
    const dispatch = useDispatch()

    // take id of blog and site from url
    const { siteId, staticPageId } = useParams()
    const navigate = useNavigate()

    const successMessage = useSelector((state) => state.app.message)
    const errorMessage = useSelector((state) => state.staticPages.errorInStaticPages)

    const singleStaticPage = useSelector((state) => state.staticPages.singleStaticPage)
    const singleSite = useSelector((state) => state.sites.singleSite)
    const tags = useSelector(state => state.tags.allTags)


    // resert form after submit
    const resetAndNavigate = ({ error }) => {
        dispatch(clearError())

        dispatch(setMessage(""))
        !error && navigate(`/sites/${siteId}/static-page`)
    }

    // setting initial Values for Formik from the blog if edit/update otherwise creating empty for it
    const initialValues = {
        site: siteId,
        page: edit && singleStaticPage ? singleStaticPage.page : "",
        description: edit && singleStaticPage ? singleStaticPage.description : "",
        metaTitle: edit && singleStaticPage ? singleStaticPage.metaTitle : "",
        metaDescription: edit && singleStaticPage ? singleStaticPage.metaDescription : "",
        metaKeywords: edit && singleStaticPage ? singleStaticPage.metaKeywords : [],
        slug: edit && singleStaticPage ? singleStaticPage.slug : "",
    }
    const onSubmitFunction = async (values) => {
        if (edit) {
            const editValue = { ...values, site: singleSite?.site, staticPageId }
            dispatch(updateStaticPagesRequest(editValue))
            return
        }
        const finalValues = { ...values, site: singleSite?.site }
        dispatch(addNewStaticPagesRequest(finalValues))
    }

    useEffect(() => {
        if (edit) {
            dispatch(singleStaticPageRequest(staticPageId))
        }
        dispatch(getAllTagsRequest(siteId))
    }, [dispatch, siteId, staticPageId]);

    return (
        <>
            {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetAndNavigate} />}
            {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetAndNavigate} error />}
            <Formik initialValues={initialValues} validationSchema={StaticPageValidationSchema} onSubmit={onSubmitFunction} >
                {({ values, setFieldValue, touched, errors }) => (
                    <div className="bg-gray-100 h-full">
                        <Form className='flex flex-wrap gap-x-20 gap-y-2 px-20 h-auto'>
                            <FieldBox value={values.page} name="page" label="Page Title" className="" />

                            {/* Meta Name */}
                            <FieldBox value={values.metaTitle} name="metaTitle" label="Meta Title" />

                            {/* Meta description */}
                            <FieldBox value={values.metaDescription} name="metaDescription" label="Meta Description" />
                            {/* Cover Alt */}

                            <div className="col-span-2 gap-4">
                                {/* Meta Keywords */}
                                <label className='col-span-1 text-right text-sm' htmlFor="metaKeywords"> Meta Keywords : </label>
                                <Field as={MultiSelect} options={tags} name="metaKeywords" selected={edit ? singleStaticPage?.metaKeywords?.split(",") : []} />
                            </div>

                            {/* slug */}
                            <FieldBox value={values.slug} name="slug" label="Slug" />

                            <div className="w-full bg-white">
                                <QuillEditor
                                    id="description"
                                    value={values.description}
                                    onChange={(val) => setFieldValue('description', val)}
                                    error={Boolean(touched.content && errors.description)}
                                />
                            </div>

                            <div className="text-center w-full ">
                                <button className=" px-4 py-2 rounded bg-blue-700 text-white  disabled:bg-gray-200 " type="submit"  >Submit</button>
                            </div>

                        </Form>
                    </div>

                )}
            </Formik>
        </>
    )
}

export default AddUpdateStaticPage