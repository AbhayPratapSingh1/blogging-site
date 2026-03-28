import React, { useEffect, useState } from 'react'
import * as yup from "yup"
import { QuillEditor } from "../editor"
import { Field, Form, Formik, useField, useFormikContext } from "formik"
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategoryRequest } from '../../features/categorySlice'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllTagsRequest } from '../../features/tagsSlice'
import { FieldBox } from '../common/fieldBox'
import { uploadImageToAPI } from '../../utils/helper'
import { addNewBlogRequest, clearError, setSingleBlog, singleBlogRequest, updateBlogRequest } from '../../features/blogSlice'
import MultiSelect from '../common/multiSelect'
import { setMessage, toggleMultiSelectMenu } from '../../features/appSlice'
import NotificationModal from '../modals/NotificationModal'
import { blogAPI } from '../../api/blogAPI'
import Faq from '../common/faq'

const BlogValidationSchema = yup.object({
    site: yup.string().required(),
    title: yup.string().required("Title can't be blank"),
    description: yup.string().required(),
    category: yup.string().required("Category can't be blank"),
    tags: yup.string().required("Tags can't be blank"),
    metaTitle: yup.string().required("Meta Title can't be blank"),
    metaDescription: yup.string().required("Meta Description can't be blank"),
    metaKeywords: yup.string().required("Meta Keywords can't be blank"),
    faqHeading: yup.string(),
    slug: yup.string(),
    redirectUrl: yup.string(),
    coverAlt: yup.string().required(),
    faqs: yup.array()
});

function AddUpdateBlogsForm({ edit }) {
    // create a displch for dispatching thing in the page
    const dispatch = useDispatch()

    // take id of blog and site from url
    const { siteId, blogId } = useParams()
    const navigate = useNavigate()

    // sucess and error message on submit
    const successMessage = useSelector((state) => state.app.message)
    const errorMessage = useSelector((state) => state.blogs.errorInBlogs)
    // initialising global variable from redux : all Category, all Tags, single blog, 
    const category = useSelector(state => state.category.allCategories)
    const tags = useSelector(state => state.tags.allTags)
    const singleBlog = useSelector((state) => state.blogs.singleBlog)

    // create local variable for uploading image
    const [imageFile, setImageFile] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")

    // resert form after submit
    const resetAndNavigate = ({ error }) => {
        dispatch(clearError())
        dispatch(setMessage(""))
        !error && navigate(`/sites/${siteId}/blogs`)
    }

    // setting initial Values for Formik from the blog if edit/update otherwise creating empty for it
    const initialValues = {
        site: siteId,
        title: edit && singleBlog ? singleBlog.title : "",
        description: edit && singleBlog ? singleBlog.description : "",
        category: edit && singleBlog ? singleBlog.category : "",
        tags: edit && singleBlog ? singleBlog.tags : [],
        metaTitle: edit && singleBlog ? singleBlog.metaTitle : "",
        metaDescription: edit && singleBlog ? singleBlog.metaDescription : "",
        metaKeywords: edit && singleBlog ? singleBlog.metaKeywords : [],
        faqHeading: edit && singleBlog ? singleBlog.faqHeading : "",
        // redirectUrl:  it && singleBlog ? singleBlog.redirectUrl : "",
        redirectUrl: edit && singleBlog ? singleBlog.redirectUrl : "",
        slug: edit && singleBlog ? singleBlog.slug : "",
        coverAlt: edit && singleBlog ? singleBlog.coverAlt : "",
        faqs: edit && singleBlog ? singleBlog.faqs : [],
        images: edit && singleBlog ? singleBlog.images : {},
    }
    // console.log("tags",singleBlog.tags.split(","));

    // setting the url if the image is present


    // ___________________________________________________________________________-submit function ________________________________________________________________
    const onSubmitFunction = async (values) => {
        try {
            if (!imageUrl) {
                console.log("image error happend");
                return;
            }
            // delete after testing!!!//////////////////////////
            else {
                console.log("image Url is verified : ", imageUrl);
            }//////////////////////////////////////////////////

            // uploading image to server and getting the image object
            const uploadedObj = await uploadImageToAPI(imageFile);

            if (uploadedObj) {
                const sendData = edit ? { ...values, ...uploadedObj, blogId } : { ...values, ...uploadedObj }
                console.log("all data with Image", sendData)
                // uploading new blog to server
                dispatch(edit ? updateBlogRequest(sendData) : addNewBlogRequest(sendData));
            }
            else {
                console.log("Image file cannot be uploaded returning without uploading");
            }

            // setSubmitting(false);
            // resetForm();
        } catch (error) {
            console.error("error in uploading data in the server : ", error);
            // setSubmitting(false);
            // setErrors(error);
        }
    }

    // ------------------------------------------------------------------


    // _______________________________Image uploader function_____________
    const onImageUpload = (event) => {
        // getting the uploaded file
        const file = event.target.files[0];
        // if file is recieved
        if (file) {
            // creating a reader
            const reader = new FileReader();
            // 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111

            // setting loading end function in reader obj
            //111111111111111111111111111111111111111111111111111111111111111111111111111 when did this function will run and where
            reader.onloadend = () => {
                //setting url to local variable
                setImageUrl(reader.result);
            };
            // getting the url and the file from it
            reader.readAsDataURL(file); // why this is used here??
            // setting local variable
            setImageFile(file);
        }
    }

    // create a function for getting global values blog(if edit), categorieS, tagS
    useEffect(() => {
        if (edit) {
            async function fecthSingle() {
                const data = await blogAPI.single(blogId)
                dispatch(setSingleBlog(data))
                setImageUrl(data?.images?.url)
            }
            fecthSingle()
        }
        dispatch(getAllCategoryRequest(siteId))
        dispatch(getAllTagsRequest(siteId))
    }, [dispatch, siteId, blogId]);
    
    // --------------------------------------------------------
    const addFaq = (value, setFaq)=>{
        const questionAnswer = {question, answer}
        const values = [...value , questionAnswer]
        setFaq("faqs",values)
    }
    
    return (
        
        
        <>
            {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetAndNavigate} />}
            {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetAndNavigate} error />}
            {/*  taking the formik tag setting : initialValue, validationSchema , onSubmit function, */}
            <Formik initialValues={initialValues} validationSchema={BlogValidationSchema} onSubmit={onSubmitFunction} >
                {/* creating a function responsible for creating input with formik */}
                {/* values : are the values i guess , setFieldVlaue is a function responsible for setting value by its own, touches ?? , errors are maybe describe the error in the form */}
                {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                    
                    // create a form object since it is a form, since there is single value then maybe it is its return type too
                    <Form className='bg-gray-100 flex gap-x-20 gap-y-3 px-5 py-5 flex-wrap'>
                        {/* Image upload */}
                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className="bg-white w-96 h-48 col-span-2 flex justify-around">
                            <label htmlFor="dropzone-file" className=" bg-white w-full flex flex-col items-center justify-center h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className=" flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className=" w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" onChange={onImageUpload} className="hidden" />
                            </label>


                        </div>
                        {imageUrl && <img className="h-48 w-auto" alt="Image uploaded" src={imageUrl} />}
                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className="w-full"></div>
                        {/* Name input */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.title} name="title" label="Blog Name" className="w-96" />
                        {/* <div className="col-span-2"></div> setting single item in fir   st line */}

                        {/* Catregory selection block */}
                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className=" h-10 w-96">
                            <label className=' text-right text-sm text-gray-600' htmlFor="category"> Category : </label>
                            <select className='h-full w-full col-span-1 max-w-96 px-2 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  ' onChange={(e) => setFieldValue('category', e.target.value)}>
                                {/*  how can i add the selected categroy here while editing the previous value of the databaes */}
                                {category && category.length > 0 && category.map((each, index) => {
                                    return (
                                        <option key={index} value={each.categoryName} >{each.categoryName}</option>
                                    )
                                })}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className=" text-gray-600 gap-4">
                            <label className='col-span-1 text-left text-sm' htmlFor="tags"> Tags : </label>
                            {/* <Field as={MultiSelect} options={tags} name="tags" selected={edit ? [singleBlog?.tags?.split(",")] : []} /> */}
                            {/* {console.log("slecte doption sL ",values, valuestags.length>0 ? values.tags.split(",") : "")} */}
                            <Field as={MultiSelect} options={tags} name="tags" selected={values?.tags?.length>0 ? values?.tags?.split(",") : ""} />
                        </div>

                        {/* Meta Name */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.metaTitle} name="metaTitle" label="Meta Title" className="w-96" />

                        {/* Meta description */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.metaDescription} name="metaDescription" label="Meta Description" className="w-96" />
                        {/* Cover Alt */}

                        {/* Redirect */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.redirectUrl} name="redirectUrl" label="Redirect Url" className="w-96" />

                        {/* FAQ Heading */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.faqHeading} name="faqHeading" label="FAQ Heading" className="w-96" />

                        <div className="col-span-2 gap-4 ">

                            {/* Meta Keywords */}
                            <label className='col-span-1 text-right text-sm' htmlFor="metaKeywords"> Meta Keywords : </label>
                            <Field as={MultiSelect} options={tags} name="metaKeywords" selected={values?.metaKeywords?.length>0 ? values?.metaKeywords?.split(","):""} />
                            {/* <Field as={MultiSelect} options={tags} name="metaKeywords" selected={edit ? singleBlog?.metaKeywords.split(",") : []} /> */}

                        </div>

                        {/* slug */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.slug} name="slug" label="Slug" className="w-96" />

                        {/* slug */}
                        <FieldBox onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} value={values?.coverAlt} name="coverAlt" label="Blog Image Alt" className="w-96" />
                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className="flex w-full items-center gap-20 me-10">
                            <div className=" flex-grow ">
                                <div className="w-full">
                                    <label className='text-right text-sm text-gray-600' htmlFor="question">Question : </label>
                                    <input onChange={(e)=>{setQuestion(e.target.value)}} value={question} className={` col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} name='question' placeholder="Enter Here" />
                                </div>
                                <div className="w-full">
                                    <label className='text-right text-sm text-gray-600' htmlFor="answer">Answer : </label>
                                    <input  onChange={(e)=>{setAnswer(e.target.value)}} value={answer}  className={`col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} name='answer' placeholder="Enter Here" />
                                </div>
                            </div>
                            <div className="cursor-pointer ">
                                <div onClick={()=>addFaq(values.faqs, setFieldValue)} className="flex items-center text-center h-20 rounded-full border-dashed border-gray-500 border bg-gray-200 px-8 py-1 text-sm text-gray-600 w-max">Add Faq</div>
                            </div>
                        </div>

                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className="w-full">
                            <Faq setFaq={setFieldValue} faqList={edit ? singleBlog.faqs : values.faqs} />
                        </div>

                        <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className=" w-full bg-white">
                            <QuillEditor
                                id="description"
                                value={values.description}
                                onChange={(val) => setFieldValue('description', val)}
                                error={Boolean(touched.content && errors.description)}
                            />
                        </div>
                        <div  onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className="w-full text-center ">
                            <button onClick={() => { console.log("click on the vtuuton") }} disabled={false} className=" px-4 py-2 rounded bg-blue-700 text-white  disabled:bg-gray-200 " type="submit"  >Submit</button>
                        </div>

                    </Form>

                )}
            </Formik>
        </>
    )
}

export default AddUpdateBlogsForm