from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Tag
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Tag))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, tag_id: str) -> Optional[dict]:
    result = await db.execute(select(Tag).where(Tag.id == tag_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(select(Tag).where(Tag.site_id == site_id))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def create(db: AsyncSession, data: dict) -> str:
    tag = Tag(**data)
    db.add(tag)
    await db.commit()
    return tag.id


async def update_tag(db: AsyncSession, tag_id: str, data: dict) -> None:
    await db.execute(update(Tag).where(Tag.id == tag_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, tag_id: str) -> None:
    await db.execute(delete(Tag).where(Tag.id == tag_id))
    await db.commit()
