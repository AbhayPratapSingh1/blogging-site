import { Link } from "react-router-dom"

export function LinkButton({name , description, icon , link}){
    return (
        <Link to={link}>
            <div className="border bg-gray-50 shadow-xl rounded-xl w-56 p-4 h-40 flex flex-col justify-evenly items-center text-center z-10 hover:-translate-y-3 transition-all duration-500">
                <div className="flex justify-center text-center text-5xl text-gray-600">{icon?icon:""}</div>
                <p className="text-md text-gray-800">{name}</p>
                {description && <p className="text-sm text-gray-400">{description}</p>}
                
            </div>
        </Link>
    )
}
        // <Link to={link}>
        //     <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{name}</button>
        // </Link>