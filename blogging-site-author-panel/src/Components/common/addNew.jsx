import { CiCirclePlus } from "react-icons/ci"
import { Link } from "react-router-dom"

const AddNew = ({link})=>{
    return (
        <div className="mx-auto px-4 py-3 bg-white border border-dashed border-gray-300 rounded-xl flex justify-center items-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
          <Link to={link}>
            <div className="text-gray-500 text-3xl flex items-center gap-2 hover:text-blue-600">
              <CiCirclePlus />
              <span className="text-sm font-medium">Add New</span>
            </div>
          </Link>
        </div>
    )
}

export default AddNew
