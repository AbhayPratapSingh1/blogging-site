'use server'
import { Inter } from "next/font/google";
import Header from "./Components/commonToAll/header";
import "./globals.css";
import Footer from "./Components/commonToAll/footer";
import { capitalise } from "./Components/helper";
import { getLogo, getNav, getSocialMedia, homeMetaText } from "./serverCalls";

const inter = Inter({ subsets: ["latin"], display: 'swap', });

export const generateMetadata = async () => {
  const data = await homeMetaText()
  return {
    title: capitalise(data.metaTitle),
    keywords: data.metaKeywords,
    description: data.metaDescription,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_CLIENT_URL || undefined,
    },
    openGraph: {
      locale: "en_IN",
      type: "website",
    },
  }
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
        <Footer socialMedia={socialMedias} staticPages={navTags} />
        <hr />
      </body>
    </html>
  );
}
