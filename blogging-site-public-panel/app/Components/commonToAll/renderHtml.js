import React from 'react'
export default function RenderHtml({html}) {
  return (
        <div className='blog-content max-w-4xl p-2 md:p-4 mx-auto my-8' dangerouslySetInnerHTML={{__html:html}}  />
  )
}