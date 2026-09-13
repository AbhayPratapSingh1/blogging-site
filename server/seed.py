import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.database import engine, async_session
from app.models import Base
from seed_data import authors, blogs, categories, tags, navigation, social_media, static_pages, sites


async def seed():
    async with engine.begin() as conn:
        # Drop all tables
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(text(f"DROP TABLE IF EXISTS {table.name} CASCADE"))
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        for s in sites:
            await db.execute(text(
                "INSERT INTO sites (id, name, is_active, created_at, updated_at) VALUES (:id, :name, :is_active, :created_at, :updated_at)"
            ), s)
        for a in authors:
            await db.execute(text(
                "INSERT INTO authors (id, name, email, profile_pic, created_at, updated_at) VALUES (:id, :name, :email, :profile_pic, :created_at, :updated_at)"
            ), {**a, "profile_pic": __import__("json").dumps(a["profile_pic"])})
        for b in blogs:
            await db.execute(text(
                "INSERT INTO blogs (id, title, description, slug, category, tags, meta_title, meta_keywords, meta_description, author, images, cover_alt, faq_heading, faqs, redirect_url, site_id, featured, created_at, updated_at) VALUES (:id, :title, :description, :slug, :category, :tags, :meta_title, :meta_keywords, :meta_description, :author, :images, :cover_alt, :faq_heading, :faqs, :redirect_url, :site_id, :featured, :created_at, :updated_at)"
            ), {**b, "author": __import__("json").dumps(b["author"]), "images": __import__("json").dumps(b["images"]), "faqs": __import__("json").dumps(b.get("faqs"))})
        for c in categories:
            await db.execute(text(
                "INSERT INTO categories (id, category_name, site_id, created_at, updated_at) VALUES (:id, :category_name, :site_id, :created_at, :updated_at)"
            ), c)
        for t in tags:
            await db.execute(text(
                "INSERT INTO tags (id, tag_name, site_id, created_at, updated_at) VALUES (:id, :tag_name, :site_id, :created_at, :updated_at)"
            ), t)
        for n in navigation:
            await db.execute(text(
                "INSERT INTO navigation (id, name, link, position, site_id, created_at, updated_at) VALUES (:id, :name, :link, :position, :site_id, :created_at, :updated_at)"
            ), n)
        for sm in social_media:
            await db.execute(text(
                "INSERT INTO social_media (id, name, link, site_id, created_at, updated_at) VALUES (:id, :name, :link, :site_id, :created_at, :updated_at)"
            ), sm)
        for sp in static_pages:
            await db.execute(text(
                "INSERT INTO static_pages (id, title, slug, description, site_id, created_at, updated_at) VALUES (:id, :title, :slug, :description, :site_id, :created_at, :updated_at)"
            ), sp)
        await db.commit()

    print("Database seeded successfully!")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
