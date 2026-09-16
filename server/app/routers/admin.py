import time
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth import verify_token
from app.cloudinary import upload_image
from app.repositories import site, blog, category, tag, navigation, author, social_media, static_page
from app.schemas import (
    CreateSiteRequest, UpdateSiteRequest,
    CreateBlogRequest, UpdateBlogRequest,
    CreateCategoryRequest, UpdateCategoryRequest,
    CreateTagRequest, UpdateTagRequest,
    RegisterAuthorRequest, UpdateAuthorRequest,
    CreateNavigationRequest, UpdateNavigationRequest,
    CreateSocialRequest, UpdateSocialRequest,
    CreateStaticPageRequest, UpdateStaticPageRequest,
)

router = APIRouter(prefix="/api", tags=["admin"], dependencies=[Depends(verify_token)])


def now_ms() -> int:
    return int(time.time() * 1000)


# ─── Sites ─────────────────────────────────────────────────────────────
@router.get("/sites")
async def get_sites(db: AsyncSession = Depends(get_db)):
    return await site.find_all(db)


@router.post("/sites")
async def create_site(body: CreateSiteRequest, db: AsyncSession = Depends(get_db)):
    site_id = await site.create(db, {"name": body.name, "is_active": True, "created_at": now_ms()})
    return {"status": True, "message": "Site created", "id": site_id}


@router.get("/single-site/{site_id}")
async def get_single_site(site_id: str, db: AsyncSession = Depends(get_db)):
    s = await site.find_by_id(db, site_id)
    if not s:
        raise HTTPException(status_code=404, detail="Not Found")
    return s


@router.put("/single-site/{site_id}")
async def update_single_site(site_id: str, body: UpdateSiteRequest, db: AsyncSession = Depends(get_db)):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        return {"error": "Request body is empty"}
    if "isActive" in data:
        data["is_active"] = data.pop("isActive")
    await site.update_site(db, site_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/single-site/{site_id}")
async def delete_single_site(site_id: str, db: AsyncSession = Depends(get_db)):
    s = await site.find_by_id(db, site_id)
    if s:
        await site.remove(db, site_id)
        return {"message": "Deleted!"}
    raise HTTPException(status_code=404, detail="Not Found")


# ─── Sites (alt routes) ───────────────────────────────────────────────
@router.get("/user-detail/{item_id}")
async def get_user_detail_by_id(item_id: str, db: AsyncSession = Depends(get_db)):
    s = await site.find_by_id(db, item_id)
    if s:
        return s
    a = await author.find_by_id(db, item_id)
    if a:
        return a
    raise HTTPException(status_code=404, detail="Not Found")


@router.put("/site/{site_id}")
async def update_site_alt(site_id: str, body: UpdateSiteRequest, db: AsyncSession = Depends(get_db)):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not data:
        return {"error": "Request body is empty"}
    if "isActive" in data:
        data["is_active"] = data.pop("isActive")
    await site.update_site(db, site_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/site/{site_id}")
async def delete_site_alt(site_id: str, db: AsyncSession = Depends(get_db)):
    await site.remove(db, site_id)
    return {"message": "Deleted!"}


# ─── Blogs/Pages ───────────────────────────────────────────────────────
@router.get("/pages-by-site-id/{site_id}")
async def get_blogs_by_site(site_id: str, page: int = None, limit: int = None, db: AsyncSession = Depends(get_db)):
    if page is not None and limit is not None:
        return await blog.find_by_site_id_paginated(db, site_id, page, limit)
    return await blog.find_by_site_id(db, site_id)


@router.post("/add-new-page")
async def create_blog(body: CreateBlogRequest, db: AsyncSession = Depends(get_db)):
    data = body.model_dump()
    data = {k: v for k, v in data.items() if v is not None}
    # Convert camelCase to snake_case for DB
    if "siteId" in data:
        data["site_id"] = data.pop("siteId")
    if "metaTitle" in data:
        data["meta_title"] = data.pop("metaTitle")
    if "metaDescription" in data:
        data["meta_description"] = data.pop("metaDescription")
    if "metaKeywords" in data:
        data["meta_keywords"] = data.pop("metaKeywords")
    if "coverAlt" in data:
        data["cover_alt"] = data.pop("coverAlt")
    if "faqHeading" in data:
        data["faq_heading"] = data.pop("faqHeading")
    if "redirectUrl" in data:
        data["redirect_url"] = data.pop("redirectUrl")
    ts = now_ms()
    data["site_id"] = data.get("site_id", "site-id-1")
    data["created_at"] = ts
    data["updated_at"] = ts
    blog_id = await blog.create(db, data)
    return {"status": True, "message": "Blog created", "id": blog_id}


@router.get("/single-page/{blog_id}")
async def get_single_blog(blog_id: str, db: AsyncSession = Depends(get_db)):
    b = await blog.find_by_id(db, blog_id)
    if not b:
        raise HTTPException(status_code=404, detail="Not Found")
    return b


@router.put("/single-page/{blog_id}")
async def update_single_blog(blog_id: str, body: UpdateBlogRequest, db: AsyncSession = Depends(get_db)):
    data = body.model_dump()
    data = {k: v for k, v in data.items() if v is not None}
    if "siteId" in data:
        data["site_id"] = data.pop("siteId")
    if "metaTitle" in data:
        data["meta_title"] = data.pop("metaTitle")
    if "metaDescription" in data:
        data["meta_description"] = data.pop("metaDescription")
    if "metaKeywords" in data:
        data["meta_keywords"] = data.pop("metaKeywords")
    if "coverAlt" in data:
        data["cover_alt"] = data.pop("coverAlt")
    if "faqHeading" in data:
        data["faq_heading"] = data.pop("faqHeading")
    if "redirectUrl" in data:
        data["redirect_url"] = data.pop("redirectUrl")
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await blog.update_blog(db, blog_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/single-page/{blog_id}")
async def delete_single_blog(blog_id: str, db: AsyncSession = Depends(get_db)):
    await blog.remove(db, blog_id)
    return {"message": "Deleted!"}


# ─── Categories ────────────────────────────────────────────────────────
@router.get("/categories-by-site-id/{site_id}")
async def get_categories_by_site(site_id: str, db: AsyncSession = Depends(get_db)):
    return await category.find_by_site_id(db, site_id)


@router.post("/category")
async def create_category(body: CreateCategoryRequest, db: AsyncSession = Depends(get_db)):
    cat_id = await category.create(db, {"category_name": body.categoryName, "site_id": "site-id-1", "created_at": now_ms()})
    return {"status": True, "message": "Category created", "id": cat_id}


@router.get("/category/{cat_id}")
async def get_single_category(cat_id: str, db: AsyncSession = Depends(get_db)):
    c = await category.find_by_id(db, cat_id)
    if not c:
        raise HTTPException(status_code=404, detail="Not Found")
    return c


@router.put("/category/{cat_id}")
async def update_category(cat_id: str, body: UpdateCategoryRequest, db: AsyncSession = Depends(get_db)):
    data = {}
    if body.categoryName is not None:
        data["category_name"] = body.categoryName
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await category.update_category(db, cat_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/category/{cat_id}")
async def delete_category(cat_id: str, db: AsyncSession = Depends(get_db)):
    await category.remove(db, cat_id)
    return {"message": "Deleted!"}


# ─── Tags ──────────────────────────────────────────────────────────────
@router.get("/tags-by-site-id/{site_id}")
async def get_tags_by_site(site_id: str, db: AsyncSession = Depends(get_db)):
    return await tag.find_by_site_id(db, site_id)


@router.post("/tags")
async def create_tag(body: CreateTagRequest, db: AsyncSession = Depends(get_db)):
    tag_id = await tag.create(db, {"tag_name": body.tagName, "site_id": "site-id-1", "created_at": now_ms()})
    return {"status": True, "message": "Tag created", "id": tag_id}


@router.get("/tags/{tag_id}")
async def get_single_tag(tag_id: str, db: AsyncSession = Depends(get_db)):
    t = await tag.find_by_id(db, tag_id)
    if not t:
        raise HTTPException(status_code=404, detail="Not Found")
    return t


@router.put("/tags/{tag_id}")
async def update_tag(tag_id: str, body: UpdateTagRequest, db: AsyncSession = Depends(get_db)):
    data = {}
    if body.tagName is not None:
        data["tag_name"] = body.tagName
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await tag.update_tag(db, tag_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/tags/{tag_id}")
async def delete_tag(tag_id: str, db: AsyncSession = Depends(get_db)):
    await tag.remove(db, tag_id)
    return {"message": "Deleted!"}


# ─── Authors ───────────────────────────────────────────────────────────
@router.post("/admin/register")
async def register_author(body: RegisterAuthorRequest, db: AsyncSession = Depends(get_db)):
    ts = now_ms()
    author_id = await author.create(db, {"name": body.name, "email": body.email, "created_at": ts, "updated_at": ts})
    return {"status": True, "message": "Author registered", "id": author_id}


@router.get("/get-writer/{author_id}")
async def get_single_writer(author_id: str, db: AsyncSession = Depends(get_db)):
    a = await author.find_by_id(db, author_id)
    if not a:
        raise HTTPException(status_code=404, detail="Not Found")
    return a


@router.get("/authors")
async def get_all_writers(db: AsyncSession = Depends(get_db)):
    return await author.find_all(db)


@router.put("/author/{author_id}")
async def update_writer(author_id: str, body: UpdateAuthorRequest, db: AsyncSession = Depends(get_db)):
    data = body.model_dump()
    data = {k: v for k, v in data.items() if v is not None}
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await author.update_author(db, author_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/author/{author_id}")
async def delete_writer(author_id: str, db: AsyncSession = Depends(get_db)):
    await author.remove(db, author_id)
    return {"message": "Deleted!"}


# ─── Navigation ────────────────────────────────────────────────────────
@router.get("/navigation-by-site-id/{site_id}")
async def get_navigation_by_site(site_id: str, db: AsyncSession = Depends(get_db)):
    return await navigation.find_by_site_id(db, site_id)


@router.get("/navigation/{nav_id}")
async def get_single_navigation(nav_id: str, db: AsyncSession = Depends(get_db)):
    n = await navigation.find_by_id(db, nav_id)
    if not n:
        raise HTTPException(status_code=404, detail="Not Found")
    return n


@router.post("/add-navigation")
async def create_navigation(body: CreateNavigationRequest, db: AsyncSession = Depends(get_db)):
    ts = now_ms()
    nav_id = await navigation.create(db, {
        "name": body.name,
        "link": body.link,
        "position": int(body.position),
        "site_id": body.site,
        "created_at": ts,
    })
    return {"status": True, "message": "Done adding new Navigation"}


@router.put("/navigation/{nav_id}")
async def update_navigation(nav_id: str, body: UpdateNavigationRequest, db: AsyncSession = Depends(get_db)):
    data = {}
    if body.name is not None:
        data["name"] = body.name
    if body.position is not None:
        data["position"] = int(body.position)
    if body.link is not None:
        data["link"] = body.link
    if body.siteId is not None:
        data["site_id"] = body.siteId
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await navigation.update_nav(db, nav_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/navigation/{nav_id}")
async def delete_navigation(nav_id: str, db: AsyncSession = Depends(get_db)):
    await navigation.remove(db, nav_id)
    return {"message": "Deleted!"}


# ─── Social Media ──────────────────────────────────────────────────────
@router.get("/social-media-by-site-id/{site_id}")
async def get_social_by_site(site_id: str, db: AsyncSession = Depends(get_db)):
    return await social_media.find_by_site_id(db, site_id)


@router.post("/add-social-media")
async def create_social(body: CreateSocialRequest, db: AsyncSession = Depends(get_db)):
    soc_id = await social_media.create(db, {"name": body.name, "link": body.link, "site_id": "site-id-1", "created_at": now_ms()})
    return {"status": True, "message": "Social media created", "id": soc_id}


@router.get("/social-media/{social_id}")
async def get_single_social(social_id: str, db: AsyncSession = Depends(get_db)):
    s = await social_media.find_by_id(db, social_id)
    if not s:
        raise HTTPException(status_code=404, detail="Not Found")
    return s


@router.put("/social-media/{social_id}")
async def update_social(social_id: str, body: UpdateSocialRequest, db: AsyncSession = Depends(get_db)):
    data = {}
    if body.name is not None:
        data["name"] = body.name
    if body.link is not None:
        data["link"] = body.link
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await social_media.update_social(db, social_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/social-media/{social_id}")
async def delete_social(social_id: str, db: AsyncSession = Depends(get_db)):
    await social_media.remove(db, social_id)
    return {"message": "Deleted!"}


# ─── Static Pages ──────────────────────────────────────────────────────
@router.get("/static-pages-by-site-id/{site_id}")
async def get_static_pages_by_site(site_id: str, db: AsyncSession = Depends(get_db)):
    return await static_page.find_by_site_id(db, site_id)


@router.post("/add-new-static-page")
async def create_static_page(body: CreateStaticPageRequest, db: AsyncSession = Depends(get_db)):
    ts = now_ms()
    page_id = await static_page.create(db, {
        "title": body.title,
        "slug": body.slug,
        "description": body.description,
        "site_id": "site-id-1",
        "created_at": ts,
        "updated_at": ts,
    })
    return {"status": True, "message": "Static page created", "id": page_id}


@router.get("/single-static-page/{page_id}")
async def get_single_static_page(page_id: str, db: AsyncSession = Depends(get_db)):
    p = await static_page.find_by_id(db, page_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not Found")
    return p


@router.put("/single-static-page/{page_id}")
async def update_static_page(page_id: str, body: UpdateStaticPageRequest, db: AsyncSession = Depends(get_db)):
    data = {}
    if body.title is not None:
        data["title"] = body.title
    if body.slug is not None:
        data["slug"] = body.slug
    if body.description is not None:
        data["description"] = body.description
    if not data:
        return {"error": "Request body is empty"}
    data["updated_at"] = now_ms()
    await static_page.update_page(db, page_id, data)
    return {"status": True, "message": "Updated"}


@router.delete("/single-static-page/{page_id}")
async def delete_static_page(page_id: str, db: AsyncSession = Depends(get_db)):
    await static_page.remove(db, page_id)
    return {"message": "Deleted!"}


# ─── Image Upload ──────────────────────────────────────────────────────
@router.post("/upload-single-image")
async def upload_image_endpoint(file: UploadFile = File(None)):
    try:
        if file:
            contents = await file.read()
            result = await upload_image(contents, file.filename or "upload.jpg")
            return result

        return {"error": "No file provided"}
    except Exception:
        return {"error": "Upload failed"}
