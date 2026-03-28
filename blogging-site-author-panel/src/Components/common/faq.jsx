import { useState } from "react"

import { FaRegEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const Faq=({faqList, setFaq})=>{
    const [show,setShow] = useState([])
    const addShowAnswer = (index)=>{
        setShow([...show, index])
    }
    const removeShowAnswer = ({index})=>{
        let temp = []
        setShow(temp.filter(each => each != index))
    }
    const deleteQuestion = (object)=>{
        const newList = faqList.filter(one=>one != object)
        setFaq("faqs",newList)
    }
    return (
        <div className="w-full">
            {faqList?.length>0 && faqList.map((each,index) =>{
                return (
                    <div key={index} className="border border-black px-2 py-2">
                        <div className="text-sm text-gray-700 leading-6 flex">
                            <p>{each.question} ?</p>
                            <div className="flex-grow"/>
                            <div onClick={()=> {deleteQuestion(each)}} className="text-xl mx-2"><MdDeleteOutline /></div>
                            <div onClick={()=> show.includes(index) ? removeShowAnswer(index) : addShowAnswer(index)} className="text-xl"><FaRegEye /></div>
                        </div>
                        {show.includes(index) && <div className="text-sm text-gray-500">{each.answer}</div> }
                    </div>
                )
            })}
        </div>
    )
}

export default Faq