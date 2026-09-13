from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.config import settings
from app.auth import create_access_token
from app.schemas import LoginRequest

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    if body.email != settings.AUTH_EMAIL or body.password != settings.AUTH_PASSWORD:
        return {"error": "Invalid email or password"}
    token = create_access_token(body.email)
    return {"accessToken": token}


@router.get("/get-user-detail")
async def get_user_detail():
    return {
        "profilePic": {"url": "https://www.w3schools.com/howto/img_avatar.png"},
        "name": "Rajesh",
    }
