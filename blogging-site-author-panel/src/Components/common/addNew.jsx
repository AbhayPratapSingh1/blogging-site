import { CiCirclePlus } from "react-icons/ci"
import { Link } from "react-router-dom"

const AddNew = ({link})=>{
    return (
        <div className="mx-auto px-4 py-2 relative bg-gray-200 h-max border border-dashed rounded-xl border-gray-500 flex justify-center items-center">
          <Link to={link}>
            <div className="text-gray-700 text-3xl flex justify-center items-center " ><CiCirclePlus /><span className="text-sm"> add</span></div>
            {/* <p className="text-gray-700 text-center ">Add New</p> */}
          </Link>
        </div>
    )
}

export default AddNew