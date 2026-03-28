import { useDispatch } from "react-redux"
import { setMessage } from "../../features/appSlice"


const resetMessage = ({ error }) => {
    dispatch = useDispatch()
    dispatch(setMessage(""))
    dispatch(clearError())
    { !error && navigate(`/sites/${siteId}/categories`) }
}
