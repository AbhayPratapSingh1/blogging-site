import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setMessage } from '../../../features/appSlice'
import { Link } from 'react-router-dom'
import NotificationModal from '../../../Components/modals/NotificationModal'
import { clearError, deleteStaticPagesRequest, singleStaticPageRequest } from '../../../features/staticPagesSlice'
import { RiDeleteBinFill } from 'react-icons/ri'

export default function DeleteStaticPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { staticPageId, siteId } = useParams()

  // needed to be confirmed
  const staticPage = useSelector(state => state.staticPages.singleStaticPage)

  const successMessage = useSelector(state => state.app.message)
  const errorMessage = useSelector(state => state.staticPages.errorInStaticPages)


  const resetMessage = ({ error }) => {
    dispatch(setMessage(""))
    dispatch(clearError())
    { !error && navigate(`/sites/${siteId}/static-page`) }
  }

  useEffect(() => {
    dispatch(singleStaticPageRequest(staticPageId))
  }, [dispatch])

  const deleteStaticPage = (id) => {
    dispatch(deleteStaticPagesRequest(id))
  }
  return (
    <div className='w-full h-full flex justify-center items-center'>
      {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetMessage} />}
      {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetMessage} error />}
      <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-800 bg-opacity-60 overflow-hidden">
        <div className="w-[30rem] min-h-80 bg-red-50 rounded-xl p-2 ">
          <div className=" rounded-xl h-full flex items-center justify-center flex-wrap py-auto overflow-hidden">
            <RiDeleteBinFill className="text-red-500 text-[140px]" />
            <div className="basis-full text-xl  font-semibold">
              <p className="text-center h-fit text-gray-800">ARE YOU SURE TO DELETE STATIC PAGE <br/>"{staticPage.name}"</p>
              <p className="text-center h-fit text-gray-500 text-sm px-20">This is a irreversable change!</p>
            </div>
            <div className="flex justify-between w-full px-20">
              <Link to={`/sites/${siteId}/static-page`}>
                <button className=" border border-gray-400 text-gray-700 rounded-md text-xl px-5 py-1.5 my-5">
                  Cancle
                </button>
              </Link>
              <button onClick={() => { deleteStaticPage(staticPageId) }} className="bg-red-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  )
}
