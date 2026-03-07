import RenderHtml from "../Components/commonToAll/renderHtml";
import { capitalise } from "../Components/helper";




export async function generateMetadata() {
    const data = await getContactUs()
    // console.log(data);
    return {
        title: capitalise(data.metaTitle),
        keywords: data.metaKeywords,
        description: data.metaDescription,
        openGraph: {
            locale: "en_IN",
            type: "website",
        },
    }
}

export async function getContactUs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/static-page-by-slug/contact`, {
        next: { tags: ['header'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    return res.json()
}

async function ContactUs() {
    const data = await getContactUs();
    return (
        <section className="">
            <h1 className="text-center text-2xl sm:text-3xl md:text-5xl xl:text-7xl">{capitalise(data.page)}</h1>
            {data.description&&<RenderHtml html={data.description}/>}
        </section>
    )
}
export default ContactUs