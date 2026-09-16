import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearError, deleteCategoryRequest, singleCategoryRequest } from '../../../features/categorySlice'
import { setMessage } from '../../../features/appSlice'
import { Link } from 'react-router-dom'
import NotificationModal from '../../../Components/modals/NotificationModal'
import { RiDeleteBinFill } from 'react-icons/ri'

export default function DeleteCategory() {
  const { categoryId, siteId } = useParams()
  const dispatch = useDispatch()
  const category = useSelector(state => state.category.singleCategory)
  const successMessage = useSelector(state => state.app.message)
  const errorMessage = useSelector(state => state.category.errorInCategory)
  const navigate = useNavigate()

  const resetMessage = ({ error }) => {
    dispatch(setMessage(""))
    dispatch(clearError())
    if (!error) navigate(`/sites/${siteId}/categories`)
  }

  useEffect(() => {
    dispatch(singleCategoryRequest(categoryId))
  }, [dispatch, categoryId])

  const deleteCategory = (id) => {
    dispatch(deleteCategoryRequest(id))
  }

  return (
    <div className='w-full h-full flex justify-center items-center bg-gray-100'>
      {successMessage && <NotificationModal modelOpen={successMessage} message={successMessage} modelClose={resetMessage} />}
      {errorMessage && <NotificationModal modelOpen={errorMessage} message={errorMessage} modelClose={resetMessage} error />}

      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <RiDeleteBinFill className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Category?</h3>
          <p className="text-gray-600 text-center mb-2">
            Are you sure you want to delete <span className="font-medium">"{category?.categoryName}"</span>?
          </p>
          <p className="text-gray-400 text-sm text-center mb-6">This action cannot be undone.</p>
          
          <div className="flex gap-3 w-full">
            <Link to={`/sites/${siteId}/categories`} className="flex-1">
              <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </Link>
            <button 
              onClick={() => deleteCategory(categoryId)} 
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
