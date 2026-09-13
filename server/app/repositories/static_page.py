from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import StaticPage
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(StaticPage))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, page_id: str) -> Optional[dict]:
    result = await db.execute(select(StaticPage).where(StaticPage.id == page_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_slug(db: AsyncSession, slug: str) -> Optional[dict]:
    result = await db.execute(select(StaticPage).where(StaticPage.slug == slug))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(select(StaticPage).where(StaticPage.site_id == site_id))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def create(db: AsyncSession, data: dict) -> str:
    page = StaticPage(**data)
    db.add(page)
    await db.commit()
    return page.id


async def update_page(db: AsyncSession, page_id: str, data: dict) -> None:
    await db.execute(update(StaticPage).where(StaticPage.id == page_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, page_id: str) -> None:
    await db.execute(delete(StaticPage).where(StaticPage.id == page_id))
    await db.commit()
