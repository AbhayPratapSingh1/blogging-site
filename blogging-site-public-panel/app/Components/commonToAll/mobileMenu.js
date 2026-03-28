'use client'
import React, { useState } from 'react'
import Link from "next/link"
import { FiAlignJustify } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { capitalise } from '../helper';
import Image from 'next/image';
import { mediaImages } from './headerFooterComps/headerFooterComps';

export default function MobileMenu({ socialMedia, logo, nav }) {
  const [open, setOpen] = useState(false)
  // const [openCount, SetCount] = useState(0)
  return (
    <nav className='p-2 lg:hidden relative  '>
      <div className='flex justify-between items-center'>
        <Link href="/">
          <div className="h-auto w-14 overflow-hidden"><Image style={{ objectFit: "cover" }} height={200} width={200} src={logo.url} alt='logo' /></div>
        </Link>
        <div className='flex items-center'>
          <Link href={"/search/"} className="flex h-11 w-11 items-center justify-center rounded-full bg-gray lg:hover:bg-gray-2 lg:hover:text-dark lg:transition-all lg:duration-200 lg:ease-linear" aria-label="search button"><svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.1875 17.4063L14.0313 13.2188C16.1563 10.3125 15.9375 6.15625 13.2812 3.53125C11.875 2.125 10 1.34375 8 1.34375C6 1.34375 4.125 2.125 2.71875 3.53125C-0.1875 6.4375 -0.1875 11.1875 2.71875 14.0938C4.125 15.5 6 16.2813 8 16.2813C9.90625 16.2813 11.6875 15.5625 13.0938 14.2813L18.3125 18.5C18.4375 18.5938 18.5938 18.6563 18.75 18.6563C18.9688 18.6563 19.1562 18.5625 19.2812 18.4063C19.5312 18.0938 19.5 17.6563 19.1875 17.4063ZM8 14.875C6.375 14.875 4.875 14.25 3.71875 13.0938C1.34375 10.7188 1.34375 6.875 3.71875 4.53125C4.875 3.375 6.375 2.75 8 2.75C9.625 2.75 11.125 3.375 12.2812 4.53125C14.6562 6.90625 14.6562 10.75 12.2812 13.0938C11.1562 14.25 9.625 14.875 8 14.875Z" fill=""></path></svg></Link>
          <div onClick={() => setOpen(!open)} className="block text-4xl lg:hidden">{open ? <MdClose /> : <FiAlignJustify />}</div>
        </div>
      </div>
      {
        open &&
        <div className='absolute top-14 left-1 w-[calc(100%-8px)] bg-gray-300 my-2 border border-black'>
          {open &&
            nav && nav.length > 0 && nav.map((one, index) => {
              return <div key={index} className='border p-2'>
                <Link className='block ' href={one.link}>{capitalise(one.name)}</Link>
              </div>
            })}
          <div className='flex items-center gap-4 border p-2'>
            <div className='text-sm' >Follow us : </div>
            {open && socialMedia && socialMedia.length > 0 && socialMedia.map((one, index) => {
              return <Link key={index} className='block ' href={one.link}>{mediaImages[one.name]}</Link>
            })}
          </div>
        </div>
      }
    </nav >
  )
}
