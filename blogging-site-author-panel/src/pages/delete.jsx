import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearError, deleteCategoryRequest, singleCategoryRequest } from '../../../features/categorySlice'
import { setMessage } from '../../../features/appSlice'
import { Link } from 'react-router-dom'
import NotificationModal from '../../../Components/modals/NotificationModal'



export default function Delete({categoryId}) {
  const { categoryId, siteId } = useParams()
  const dispatch = useDispatch()
  const category = useSelector(state => state.category.singleCategory)
  const successMessage = useSelector(state => state.app.message)
  const errorMessage = useSelector(state => state.category.errorInCategory)
  const navigate = useNavigate()

  const resetMessage = ({ error }) => {
    dispatch(setMessage(""))
    dispatch(clearError())
    { !error && navigate(`/sites/${siteId}/categories`) }
  }

  useEffect(() => {
    dispatch(singleCategoryRequest(categoryId))
  }, [dispatch])

  const deleteCategory = (id) => {
    dispatch(deleteCategoryRequest(id))
  }
  return (
    <div className='w-full h-full flex justify-center items-center'>
      {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetMessage} />}
      {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetMessage} error />}

      <div className="">
        <h1>ARE YOU SURE TO DELETE THE CATEGORY : "{category.categoryName}" </h1>
        <div className="flex justify-around items-center">
          <button className='border border-gray-500 bg-gray-300 px-4 py-1 rounded text-xl font-extrabold' onClick={() => { deleteCategory(categoryId) }}>Yes</button>
          <Link to={`/sites/${siteId}/categories`}> <button className='border border-gray-500 bg-gray-300 px-4 py-1 rounded text-xl font-extrabold'>No</button></Link>
        </div>
      </div>
    </div>
  )
}
