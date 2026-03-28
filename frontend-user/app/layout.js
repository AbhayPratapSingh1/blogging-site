'use server'
import { Inter } from "next/font/google";
import Header from "./Components/commonToAll/header";
import "./globals.css";
import Footer from "./Components/commonToAll/footer";
import { capitalise } from "./Components/helper";

const inter = Inter({ subsets: ["latin"], display: 'swap', });

export const generateMetadata = async () => {
  const data = await homeMetaText()
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

export const homeMetaText = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta-data/home`)
  if (!res.ok) {
    return { metaDescription: "something", metaKeywords: "keywords", title: "some title" }
  }
  return res.json()
}

export const getLogo = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logo`)
  if (!res.ok) {
    return { url: "/logo.png" }
  }
  return res.json()
}


export const getNav = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-navigation`);
  if (!res.ok) {
    return []
  }
  return await res.json()

}


export const getSocialMedia = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-social-media`)
  if (!res.ok) {
    return []
  }
  const data = await res.json();
  return data
}

export default async function RootLayout({ children }) {
  const logo = await getLogo()
  const navTags = await getNav()
  const socialMedias = await getSocialMedia()
  return (
    <html lang="en">

      <body className={`${inter.className} mx-auto max-w-[1900px]`} >

        <Header socialMedia={socialMedias} nav={navTags} logo={logo} />

        <hr />
        {children}
        <hr />
        <Footer socialMedia={socialMedias} />
        <hr />
      </body>
    </html>
  );
}
