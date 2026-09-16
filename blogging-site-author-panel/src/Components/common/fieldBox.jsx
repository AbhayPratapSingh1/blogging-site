import { Field } from "formik"

export const FieldBox = ({ name, label, value, classes, ...props }) => {
    return (
        <div {...props} className="w-96">
            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor={name}>
                {label}
            </label>
            <Field 
                value={value} 
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${classes}`} 
                name={name} 
                placeholder={`Enter ${label}`}
            />
        </div>
    )
}
