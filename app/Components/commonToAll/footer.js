import Link from "next/link"
import { SlArrowUp } from "react-icons/sl";
import { mediaImages } from "./headerFooterComps/headerFooterComps";

const forwardLink = [
    { 
        name:"Privacy",
        link : "/privacy-policy"
    },{ 
        name:"Terms",
        link : "/terms-and-conditions"
    },{ 
        name:"Contact",
        link : "/contact"
    },{ 
        name:"Disclaimer",
        link : "/disclaimer"
    }
]
const Footer = ({socialMedia})=>{
    return (
        <section className="flex flex-wrap p-10 justify-between items-center ">
            <div className="text-sm my-2">© 2024 NextBlog. All rights reserved</div>
            <div className="flex gap-4 text-sm my-2">
                {forwardLink.map((each,key)=>{
                    return <Link href={each.link} key={key} className="">{each.name}</Link>
                })}
            </div>
            <div className="text-xl text-gray-600 items-center gap-2 flex my-2 mr-16">
                <div className="text-sm">Follow Us :</div>
                {socialMedia&&socialMedia.length>0&&socialMedia.map((item,key)=>{
                    return (
                        <Link href={item.link} key={key} className="">{mediaImages[item.name]}</Link>
                    )
                })}
                <Link href="#header"><button className="fixed bottom-8 p-4 right-8 rounded bg-black text-xl font-bold text-gray-100">< SlArrowUp /></button></Link>
            </div>
        </section>
    )
}

export default Footer
                                                                                                