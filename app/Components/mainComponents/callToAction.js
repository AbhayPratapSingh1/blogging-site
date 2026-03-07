const CallToAction = ()=>{
    return (
        <div className="border rounded-xl bg-white  mx-4 my-10 md:mx-28">
            <div className="grid md:grid-cols-2 p-4 justify-center items-center">
                <div className="">
                    <h3 className="text-xl md:text-3xl m-2">Subscribe to Newsletter</h3>
                    <p className="text-gray-400 m-2">Provide your email to get email notification when we launch new products or publish new articles</p>
                </div>
                <div className="flex h-fit w-full md:p-5 flex-wrap justify-center">
                    <input type="text" className="px-4 py-2 border flex-grow rounded-lg md:mx-4 m-2" placeholder="Enter your email"/>
                    <button className="bg-black dark:bg-white  text-white dark:text-black px-6 py-3 rounded-lg m-2">Subscribe</button>
                </div>
            </div>            
        </div>
    )
}
export default CallToAction