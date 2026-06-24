export const getConfig = () => {
  const MONGODB_URI = Deno.env.get("MONGODB_URI") || "mongodb://localhost:27017/blogging-platform"
  const PORT = Deno.env.get("PORT") || 8000
  const JWT_SECRET = Deno.env.get("JWT_SECRET") || "12345678"
  const AUTH_EMAIL = Deno.env.get("AUTH_EMAIL") || "user@gmail.com"
  const AUTH_PASSWORD = Deno.env.get("AUTH_PASSWORD") || "12345"
  const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME") || ""
  const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY") || ""
  const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET") || ""

  return {
    MONGODB_URI,
    PORT: Number(PORT),
    JWT_SECRET,
    AUTH_EMAIL,
    AUTH_PASSWORD,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  }
}
