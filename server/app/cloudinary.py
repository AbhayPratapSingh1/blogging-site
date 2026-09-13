import hashlib
import time
import httpx
from app.config import settings

STUB_URL = "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"


async def upload_image(file_bytes: bytes, filename: str = "upload.jpg") -> dict:
    cloud_name = settings.CLOUDINARY_CLOUD_NAME
    api_key = settings.CLOUDINARY_API_KEY
    api_secret = settings.CLOUDINARY_API_SECRET

    if not cloud_name or not api_key or not api_secret:
        return {"url": STUB_URL}

    timestamp = int(time.time())
    param_str = f"timestamp={timestamp}"
    signature = hashlib.sha1((param_str + api_secret).encode()).hexdigest()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload",
            data={
                "api_key": api_key,
                "timestamp": str(timestamp),
                "signature": signature,
            },
            files={"file": (filename, file_bytes, "image/jpeg")},
        )

    if response.status_code != 200:
        raise Exception(f"Cloudinary upload failed ({response.status_code}): {response.text}")

    data = response.json()
    return {"url": data["secure_url"]}
