from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Navigation
from app.utils import row_to_dict, to_camel_dict, to_camel_list, _FIELD_RENAME


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Navigation))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()], _FIELD_RENAME)


async def find_by_id(db: AsyncSession, nav_id: str) -> Optional[dict]:
    result = await db.execute(select(Navigation).where(Navigation.id == nav_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row), _FIELD_RENAME) if row else None


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(
        select(Navigation).where(Navigation.site_id == site_id).order_by(Navigation.position)
    )
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()], _FIELD_RENAME)


async def create(db: AsyncSession, data: dict) -> str:
    nav = Navigation(**data)
    db.add(nav)
    await db.commit()
    return nav.id


async def update_nav(db: AsyncSession, nav_id: str, data: dict) -> None:
    await db.execute(update(Navigation).where(Navigation.id == nav_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, nav_id: str) -> None:
    await db.execute(delete(Navigation).where(Navigation.id == nav_id))
    await db.commit()
