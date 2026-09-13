from pydantic import BaseModel
from typing import Optional, Union, List


# ─── Auth ──────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    accessToken: str


# ─── Site ──────────────────────────────────────────────────────────────
class CreateSiteRequest(BaseModel):
    name: str


class UpdateSiteRequest(BaseModel):
    name: Optional[str] = None
    isActive: Optional[bool] = None


# ─── Blog ──────────────────────────────────────────────────────────────
class BlogAuthor(BaseModel):
    authorId: Optional[str] = None
    name: Optional[str] = None
    url: Optional[str] = None


class BlogImages(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None


class BlogFaq(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None


class CreateBlogRequest(BaseModel):
    title: str
    description: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    metaKeywords: Optional[str] = None
    author: Optional[BlogAuthor] = None
    images: Optional[BlogImages] = None
    coverAlt: Optional[str] = None
    faqHeading: Optional[str] = None
    faqs: Optional[List[BlogFaq]] = None
    redirectUrl: Optional[str] = None
    siteId: Optional[str] = None


class UpdateBlogRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    featured: Optional[bool] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    metaKeywords: Optional[str] = None
    author: Optional[BlogAuthor] = None
    images: Optional[BlogImages] = None
    coverAlt: Optional[str] = None
    faqHeading: Optional[str] = None
    faqs: Optional[List[BlogFaq]] = None
    redirectUrl: Optional[str] = None


# ─── Category ──────────────────────────────────────────────────────────
class CreateCategoryRequest(BaseModel):
    categoryName: str


class UpdateCategoryRequest(BaseModel):
    categoryName: Optional[str] = None


# ─── Tag ───────────────────────────────────────────────────────────────
class CreateTagRequest(BaseModel):
    tagName: str


class UpdateTagRequest(BaseModel):
    tagName: Optional[str] = None


# ─── Author ────────────────────────────────────────────────────────────
class RegisterAuthorRequest(BaseModel):
    name: str
    email: str


class UpdateAuthorRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    profilePic: Optional[dict] = None


# ─── Navigation ────────────────────────────────────────────────────────
class CreateNavigationRequest(BaseModel):
    name: str
    position: Union[int, str]
    link: str
    site: str


class UpdateNavigationRequest(BaseModel):
    name: Optional[str] = None
    position: Optional[Union[int, str]] = None
    link: Optional[str] = None
    siteId: Optional[str] = None


# ─── Social Media ──────────────────────────────────────────────────────
class CreateSocialRequest(BaseModel):
    name: str
    link: str


class UpdateSocialRequest(BaseModel):
    name: Optional[str] = None
    link: Optional[str] = None


# ─── Static Page ───────────────────────────────────────────────────────
class CreateStaticPageRequest(BaseModel):
    title: str
    slug: str
    description: str


class UpdateStaticPageRequest(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
