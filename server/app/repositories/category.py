from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Category
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Category))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, category_id: str) -> Optional[dict]:
    result = await db.execute(select(Category).where(Category.id == category_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(select(Category).where(Category.site_id == site_id))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def create(db: AsyncSession, data: dict) -> str:
    category = Category(**data)
    db.add(category)
    await db.commit()
    return category.id


async def update_category(db: AsyncSession, category_id: str, data: dict) -> None:
    await db.execute(update(Category).where(Category.id == category_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, category_id: str) -> None:
    await db.execute(delete(Category).where(Category.id == category_id))
    await db.commit()
