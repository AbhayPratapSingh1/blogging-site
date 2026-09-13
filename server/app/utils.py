import re
from typing import Any, Dict, List, Optional


def _to_camel(snake: str) -> str:
    parts = snake.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


# Fields that need special renaming (DB col → frontend key)
_FIELD_RENAME = {
    "id": "_id",
    "site_id": "site",       # used by Navigation, SocialMedia
    "is_active": "isActive",
    "profile_pic": "profilePic",
    "category_name": "categoryName",
    "tag_name": "tagName",
    "meta_title": "metaTitle",
    "meta_description": "metaDescription",
    "meta_keywords": "metaKeywords",
    "cover_alt": "coverAlt",
    "faq_heading": "faqHeading",
    "redirect_url": "redirectUrl",
}

# For Blog table, site_id should become siteId (not site)
_BLOG_SITE_RENAME = {"site_id": "siteId"}

# For entities that don't have Navigation/SocialMedia-style "site" field
_GENERIC_RENAME = {
    "id": "_id",
    "is_active": "isActive",
    "profile_pic": "profilePic",
    "category_name": "categoryName",
    "tag_name": "tagName",
    "meta_title": "metaTitle",
    "meta_description": "metaDescription",
    "meta_keywords": "metaKeywords",
    "cover_alt": "coverAlt",
    "faq_heading": "faqHeading",
    "redirect_url": "redirectUrl",
    "site_id": "siteId",
}


def row_to_dict(row) -> dict:
    return {c.key: getattr(row, c.key) for c in row.__table__.columns}


def to_camel_dict(data: dict, rename: Optional[Dict[str, str]] = None) -> dict:
    if rename is None:
        rename = _GENERIC_RENAME
    result = {}
    for k, v in data.items():
        new_key = rename.get(k, _to_camel(k))
        result[new_key] = v
    return result


def to_camel_list(items: List[dict], rename: Optional[Dict[str, str]] = None) -> List[dict]:
    return [to_camel_dict(item, rename) for item in items]
