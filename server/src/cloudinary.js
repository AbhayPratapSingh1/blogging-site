import { getConfig } from "./config.js"

const STUB_URL = "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"

const hex = (buf) =>
  Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")

const sha1 = async (str) => {
  const enc = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest("SHA-1", enc)
  return hex(hash)
}

export const uploadImage = async (fileBuffer, fileName) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = getConfig()

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary not configured. Returning stub URL.")
    return { url: STUB_URL }
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const params = { timestamp }
  const paramStr = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&")
  const signature = await sha1(paramStr + CLOUDINARY_API_SECRET)

  const formData = new FormData()
  formData.append("file", new Blob([fileBuffer], { type: "image/jpeg" }), fileName || "upload.jpg")
  formData.append("api_key", CLOUDINARY_API_KEY)
  formData.append("timestamp", String(timestamp))
  formData.append("signature", signature)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Cloudinary upload failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  return { url: data.secure_url }
}
