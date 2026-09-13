import re
from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories import blog, navigation, social_media, author, static_page

router = APIRouter(tags=["public"])

COVER_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"


@router.get("/logo")
async def get_logo():
    return {"url": "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"}


@router.get("/meta-data/{page}")
@router.get("/get-meta-by-page/{page}")
async def get_page_meta_data(page: str, db: AsyncSession = Depends(get_db)):
    if page == "home":
        return {
            "metaTitle": "Gotta Catch 'Em All | Ultimate Pokémon Strategy & News",
            "metaKeywords": "Pokémon, Pokedex, Gaming News, Nintendo Switch, Strategy Guide",
            "metaDescription": "Your premier destination for the latest Pokémon battle strategies, regional guides, and breaking news from the world of Nintendo gaming.",
        }
    if page == "blog":
        import time
        return {
            "metaTitle": "The Trainer's Journal | Latest Articles & Tips",
            "metaDescription": "Deep dives into game mechanics, hidden secrets, and community stories from across the Pokémon universe.",
            "metaKeywords": "Pokemon, gaming, strategy, community",
        }

    sp = await static_page.find_by_slug(db, page)
    if sp:
        desc = re.sub(r"<[^>]*>", "", sp.get("description", "")).strip()[:160]
        return {
            "metaTitle": sp["title"],
            "metaDescription": desc,
            "metaKeywords": "",
        }

    return PlainTextResponse("Not Found", status_code=404)


@router.get("/get-navigation")
async def get_navigation(db: AsyncSession = Depends(get_db)):
    return await navigation.find_by_site_id(db, "site-id-1")


@router.get("/get-social-media")
async def get_social_media(db: AsyncSession = Depends(get_db)):
    social = await social_media.find_all(db)
    if social:
        return social
    return [
        {"name": "facebook", "link": "/"},
        {"name": "whatsapp", "link": "/ws"},
        {"name": "linkedin", "link": "/in"},
        {"name": "twitter", "link": "/tw"},
        {"name": "instagram", "link": "/ig"},
    ]


@router.get("/blogs")
async def get_all_blogs(db: AsyncSession = Depends(get_db)):
    return await blog.find_all(db)


@router.get("/single-fetaured")
async def get_featured(db: AsyncSession = Depends(get_db)):
    featured = await blog.find_featured(db)
    if featured:
        return featured
    all_blogs = await blog.find_all(db)
    return all_blogs[0] if all_blogs else None


@router.get("/get-blogs-by-author-id/{author_id}")
async def get_blogs_by_author(author_id: str, db: AsyncSession = Depends(get_db)):
    return await blog.find_by_author_id(db, author_id)


@router.get("/blogs-by-category/{category}")
@router.get("/pages-by-category/{category}")
async def get_blogs_by_category(category: str, db: AsyncSession = Depends(get_db)):
    return await blog.find_by_category(db, category)


@router.get("/categories")
@router.get("/category")
async def get_categories(db: AsyncSession = Depends(get_db)):
    all_blogs = await blog.find_all(db)
    seen = set()
    categories = []
    for b in all_blogs:
        cat = b.get("category")
        if cat and cat not in seen:
            seen.add(cat)
            categories.append({"categoryName": cat})
    return categories


@router.get("/all-writers")
async def get_all_writers(db: AsyncSession = Depends(get_db)):
    return await author.find_all(db)


@router.get("/static-page/{slug}")
@router.get("/static-page-by-slug/{slug}")
async def get_static_page(slug: str, db: AsyncSession = Depends(get_db)):
    page = await static_page.find_by_slug(db, slug)
    if page:
        return page
    return PlainTextResponse("Not Found", status_code=404)


@router.get("/page-by-slug/{slug}")
async def get_page_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    b = await blog.find_by_slug(db, slug)
    if b:
        return b
    return PlainTextResponse("Not Found", status_code=404)
