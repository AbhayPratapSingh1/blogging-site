from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Site
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Site))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, site_id: str) -> Optional[dict]:
    result = await db.execute(select(Site).where(Site.id == site_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def create(db: AsyncSession, data: dict) -> str:
    site = Site(**data)
    db.add(site)
    await db.commit()
    return site.id


async def update_site(db: AsyncSession, site_id: str, data: dict) -> None:
    await db.execute(update(Site).where(Site.id == site_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, site_id: str) -> None:
    await db.execute(delete(Site).where(Site.id == site_id))
    await db.commit()
