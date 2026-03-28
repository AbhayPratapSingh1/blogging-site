import { Field, useField, useFormikContext } from "formik"
import { useState } from "react";
import * as yup from "yup"

// _____________________________________________text input field Box______________________________________________________________
export const FieldBox = ({ name, label, value, classes, ...props }) => {
    return (
        <div {...props} className="w-96">
            <label className='text-right text-sm text-gray-600' htmlFor={name}>{label} : </label>
            <Field value={value} className={`max-w-96 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${classes}`} name={name} placeholder="Enter Here" />
        </div>
        
    )
}



