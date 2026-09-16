"""
Seed data for the blogging platform.
Generates 151 Pokemon blog posts with Kanto characters.
"""
import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.dirname(__file__))

from generate_pokemon_blogs import generate_seed_data, generate_categories, generate_tags, AUTHORS

SEED_TIMESTAMP = 1711639978000

# ─── Generate Pokemon Blogs ────────────────────────────────────────────────
generated_blogs = generate_seed_data()

# ─── Authors (all 15 characters) ──────────────────────────────────────────
authors = [
    {
        "id": a["id"],
        "name": a["name"],
        "email": a["email"],
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
        "profile_pic": {"url": f"https://api.dicebear.com/7.x/pixel-art/jpg?seed={a['seed']}"},
    }
    for a in AUTHORS
]

# ─── Combine original + generated blogs ────────────────────────────────────
blogs = generated_blogs

# ─── Categories (Pokemon types) ────────────────────────────────────────────
categories = generate_categories()

# ─── Tags ──────────────────────────────────────────────────────────────────
tags = generate_tags()

# ─── Navigation ────────────────────────────────────────────────────────────
navigation = [
    {"id": "nav-001", "name": "Pokedex", "link": "/pokedex", "position": 1, "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "nav-002", "name": "Gym Guides", "link": "/gyms", "position": 2, "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "nav-003", "name": "Elite Four", "link": "/elite-four", "position": 3, "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "nav-004", "name": "Team Rocket Intel", "link": "/team-rocket", "position": 4, "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "nav-005", "name": "About", "link": "/about", "position": 5, "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
]

social_media = [
    {"id": "soc-001", "name": "facebook", "link": "https://facebook.com/pokemon", "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "soc-002", "name": "whatsapp", "link": "https://wa.me/pokemon", "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "soc-003", "name": "linkedin", "link": "https://linkedin.com/company/pokemon", "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "soc-004", "name": "twitter", "link": "https://twitter.com/pokemon", "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
    {"id": "soc-005", "name": "instagram", "link": "https://instagram.com/pokemon", "site_id": "site-id-1", "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
]

static_pages = [
    {
        "id": "static-about",
        "title": "About Us",
        "slug": "about",
        "description": "<section><h2>Welcome to the Kanto Pokedex Blog</h2><p>Founded in <strong>Pallet Town</strong>, our mission is to provide the most comprehensive Pokemon research and news across the Kanto region.</p><p>Whether you're a new trainer starting your journey or a seasoned Champion, we've got the guides you need to succeed.</p></section>",
        "site_id": "site-id-1",
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
    },
    {
        "id": "static-privacy",
        "title": "Privacy Policy",
        "slug": "privacy",
        "description": "<section><h2>Your data is as safe as a Master Ball</h2><p>We take your privacy seriously. Your Trainer ID, location data, and party information are strictly confidential.</p><p>We never share your data with Team Rocket or any unauthorized organizations.</p></section>",
        "site_id": "site-id-1",
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
    },
    {
        "id": "static-contact",
        "title": "Get in Touch",
        "slug": "contact-us",
        "description": "<section><h2>Visit any Pokemon Center or message us here</h2><p>Have a question about a specific Pokemon evolution or need help with your PC storage system? Our help desk is open 24/7.</p><p>For urgent matters, contact Professor Oak's Laboratory directly.</p></section>",
        "site_id": "site-id-1",
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
    },
    {
        "id": "static-elite-four",
        "title": "The Elite Four",
        "slug": "elite-four",
        "description": "<section><h2>The Kanto Elite Four</h2><p>The final challenge before becoming Pokemon Champion. These four masters each specialize in a different type:</p><ul><li><strong>Lorelei</strong> - Ice Type Specialist</li><li><strong>Bruno</strong> - Fighting Type Master</li><li><strong>Agatha</strong> - Ghost Type Expert</li><li><strong>Lance</strong> - Dragon Type Champion</li></ul><p>Defeat all four to face the reigning Champion!</p></section>",
        "site_id": "site-id-1",
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
    },
    {
        "id": "static-team-rocket",
        "title": "Team Rocket Intel",
        "slug": "team-rocket",
        "description": "<section><h2>Classified: Team Rocket Dossier</h2><p>Team Rocket, led by the mysterious Giovanni, is a criminal organization that operates throughout Kanto.</p><p><strong>Known Operatives:</strong></p><ul><li>Jessie and James - Field agents (often defeated by Ash Ketchum)</li><li>Meowth - Rare Pokemon that can speak human language</li><li>Giovanni - Gym Leader of Viridian City (secret identity)</li></ul><p>If you encounter Team Rocket, report to the nearest Pokemon Center immediately.</p></section>",
        "site_id": "site-id-1",
        "created_at": SEED_TIMESTAMP,
        "updated_at": SEED_TIMESTAMP,
    },
]

sites = [
    {"id": "site-id-1", "name": "Kanto Pokedex", "is_active": True, "created_at": SEED_TIMESTAMP, "updated_at": SEED_TIMESTAMP},
]

# Print summary
if __name__ == "__main__":
    print(f"Total blogs: {len(blogs)}")
    print(f"Total authors: {len(authors)}")
    print(f"Total categories: {len(categories)}")
    print(f"Total tags: {len(tags)}")
