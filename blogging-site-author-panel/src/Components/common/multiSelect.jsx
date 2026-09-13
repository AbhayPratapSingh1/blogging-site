import { useFormikContext } from "formik"
import { useState } from "react"
import Select from "./multiSelectTag"

// ___________________Tag Multi Select_____________________
const MultiSelect = ({ name, options, selected }) => {
    const [val, setVal] = useState(selected?selected:[])
    const { setFieldValue } = useFormikContext()
    
    const setField = (item)=>{
        setFieldValue(name, item.join(","))
    }

    const option = options.map((each)=>{return each.tagName})
    
    return (
        <div className="w-96 bg-white">
            <Select setFieldValue={setField} selected={val} setSelected={setVal} options={option} />
        </div>
    )
}

export default MultiSelect