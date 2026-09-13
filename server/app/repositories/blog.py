from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Blog
from app.utils import row_to_dict, to_camel_dict, to_camel_list


async def find_all(db: AsyncSession) -> List[dict]:
    result = await db.execute(select(Blog))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def find_by_id(db: AsyncSession, blog_id: str) -> Optional[dict]:
    result = await db.execute(select(Blog).where(Blog.id == blog_id))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_slug(db: AsyncSession, slug: str) -> Optional[dict]:
    result = await db.execute(select(Blog).where(Blog.slug == slug))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_featured(db: AsyncSession) -> Optional[dict]:
    result = await db.execute(select(Blog).where(Blog.featured == True))
    row = result.scalars().first()
    return to_camel_dict(row_to_dict(row)) if row else None


async def find_by_author_id(db: AsyncSession, author_id: str) -> List[dict]:
    result = await db.execute(select(Blog))
    blogs = to_camel_list([row_to_dict(r) for r in result.scalars().all()])
    return [b for b in blogs if b.get("author", {}).get("authorId") == author_id]


async def find_by_category(db: AsyncSession, category: str) -> List[dict]:
    result = await db.execute(select(Blog))
    blogs = to_camel_list([row_to_dict(r) for r in result.scalars().all()])
    return [b for b in blogs if (b.get("category") or "").lower() == category.lower()]


async def find_by_site_id(db: AsyncSession, site_id: str) -> List[dict]:
    result = await db.execute(select(Blog).where(Blog.site_id == site_id))
    return to_camel_list([row_to_dict(r) for r in result.scalars().all()])


async def create(db: AsyncSession, data: dict) -> str:
    blog = Blog(**data)
    db.add(blog)
    await db.commit()
    return blog.id


async def update_blog(db: AsyncSession, blog_id: str, data: dict) -> None:
    await db.execute(update(Blog).where(Blog.id == blog_id).values(**data))
    await db.commit()


async def remove(db: AsyncSession, blog_id: str) -> None:
    await db.execute(delete(Blog).where(Blog.id == blog_id))
    await db.commit()
