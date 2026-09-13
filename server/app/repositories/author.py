from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Author
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Author))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, author_id: str) -> Optional[dict]:
    result = await db.execute(select(Author).where(Author.id == author_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_email(db: AsyncSession, email: str) -> Optional[dict]:
    result = await db.execute(select(Author).where(Author.email == email))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def create(db: AsyncSession, data: dict) -> str:
    author = Author(**data)
    db.add(author)
    await db.commit()
    return author.id


async def update_author(db: AsyncSession, author_id: str, data: dict) -> None:
    await db.execute(update(Author).where(Author.id == author_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, author_id: str) -> None:
    await db.execute(delete(Author).where(Author.id == author_id))
    await db.commit()
