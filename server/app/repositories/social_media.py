from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import SocialMedia
from app.utils import row_to_dict, to_camel_dict, to_camel_list, _FIELD_RENAME


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(SocialMedia))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()], _FIELD_RENAME)


async def find_by_id(db: AsyncSession, social_id: str) -> Optional[dict]:
    result = await db.execute(select(SocialMedia).where(SocialMedia.id == social_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row), _FIELD_RENAME) if row else None


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(select(SocialMedia).where(SocialMedia.site_id == site_id))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()], _FIELD_RENAME)


async def create(db: AsyncSession, data: dict) -> str:
    social = SocialMedia(**data)
    db.add(social)
    await db.commit()
    return social.id


async def update_social(db: AsyncSession, social_id: str, data: dict) -> None:
    await db.execute(update(SocialMedia).where(SocialMedia.id == social_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, social_id: str) -> None:
    await db.execute(delete(SocialMedia).where(SocialMedia.id == social_id))
    await db.commit()
