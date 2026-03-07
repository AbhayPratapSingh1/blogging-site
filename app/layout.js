import { Inter } from "next/font/google";
import Header from "./Components/commonToAll/header";
import Footer from "./Components/commonToAll/footer";
import "./globals.css";
import { capitalise } from "./Components/helper";

const inter = Inter({ subsets: ["latin"], display: 'swap', });

export async function generateMetadata() {
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


export async function homeMetaText() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/static-page-by-slug/home`, {
    next: { tags: ['meta'] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME
    }
  })
  return res.json()
}

export async function getLogo() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-config`, {
    next: { tags: ['header'] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME
    }
  })
  return res.json()
}


export async function getNav() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-navigation`, {
    next: { tags: ['header'] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME
    }
  })
  return res.json()
}


export async function getSocialMedia() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-social-media`, {
    next: { tags: ['header'] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME
    }
  })
  return res.json()
}

export default async function RootLayout({ children }) {
  const logo = await getLogo()
  const navTags = await getNav()
  const socialMedias = await getSocialMedia()
  return (
    <html lang="en">
      <body className={`${inter.className} mx-auto max-w-[1500px]`}>
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
