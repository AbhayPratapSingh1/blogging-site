import uuid
from sqlalchemy import Column, String, Boolean, Integer, BigInteger, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Site(Base):
    __tablename__ = "sites"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class Author(Base):
    __tablename__ = "authors"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    profile_pic = Column(JSONB)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class Blog(Base):
    __tablename__ = "blogs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text)
    slug = Column(String)
    category = Column(String)
    tags = Column(String)
    meta_title = Column(String)
    meta_description = Column(String)
    meta_keywords = Column(String)
    author = Column(JSONB)
    images = Column(JSONB)
    cover_alt = Column(String)
    faq_heading = Column(String)
    faqs = Column(JSONB)
    redirect_url = Column(String)
    site_id = Column(String)
    featured = Column(Boolean, default=False)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    category_name = Column(String, nullable=False)
    site_id = Column(String)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class Tag(Base):
    __tablename__ = "tags"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tag_name = Column(String, nullable=False)
    site_id = Column(String)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class Navigation(Base):
    __tablename__ = "navigation"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    link = Column(String, nullable=False)
    position = Column(Integer, nullable=False)
    site_id = Column(String)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class SocialMedia(Base):
    __tablename__ = "social_media"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    link = Column(String, nullable=False)
    site_id = Column(String)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)


class StaticPage(Base):
    __tablename__ = "static_pages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    site_id = Column(String)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger)
