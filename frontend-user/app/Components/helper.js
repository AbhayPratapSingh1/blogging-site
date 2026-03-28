import reactToText from 'react-to-text';

export const stringClip = (str, count) => {
  if (!str) {
    return "-"
  }
  return str?.length > count ? `${str.slice(0, count)} ...` : str
}

export function tagsToText(text){
  console.log("the text is ",reactToText("<div>this is the text</div>"));
    return reactToText(text)
} 

export const httpsToHttp = (str) => {

  return str?.includes('https') ? str.replace('https', 'http') : str
}

export function formatDate(isoDate) {
  // Create a Date object from the provided ISO date string
  const date = new Date(isoDate);

  // Define options for formatting the date
  const options = {
    month: 'long', // Specify the full name of the month
    day: 'numeric', // Specify the day of the month
    year: 'numeric' // Specify the full year
  };

  // Format the date using the toLocaleDateString() method
  return date.toLocaleDateString('en-US', options);
}

export function paragraphLength(paragraph) {
  return paragraph.split(" ").length
}

export function capitalise(string) {
  if (!string){
    return string
  }
  if (string.length < 2) {
    return string.charAt(0)
  }
  if (string.charAt(0) == ' ' && string.length > 1) {
    return capitalise(string.slice(1))
  }
  return string.charAt(0).toUpperCase() + string.slice(1)

}


export const size = { width: 512, height: 512 };

export async function getSeo(slug, canonical, generatedOgImage) {
  // fetch data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/get-meta-by-page/${slug}`
  ).then((res) => res.json());

  return {
    title: response.metaTitle,
    description: response.metaDescription,
    keywords: response.metaKeywords,
    alternates: {
      canonical: canonical || `${process.env.NEXT_PUBLIC_CLIENT_URL}/${slug}`,
    },
    openGraph: {
      locale: "en_IN",
      type: "website",
      images: generatedOgImage
        ? [generatedOgImage, { size, alt: `${slug}` }]
        : [`${process.env.NEXT_PUBLIC_CLIENT_URL}/logo.jpg`],
    },
  };
}
