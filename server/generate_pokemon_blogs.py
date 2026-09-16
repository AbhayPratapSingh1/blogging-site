"""
Generate 151 Pokemon blog posts with Kanto characters.
Run: python generate_pokemon_blogs.py > pokemon_seed_data.py
"""
import json
import re

SEED_TIMESTAMP = 1711639978000

# ─── Pokemon Data (Gen 1) ──────────────────────────────────────────────────
POKEMON = [
    (1, "Bulbasaur", "Grass", "Poison"),
    (2, "Ivysaur", "Grass", "Poison"),
    (3, "Venusaur", "Grass", "Poison"),
    (4, "Charmander", "Fire", None),
    (5, "Charmeleon", "Fire", None),
    (6, "Charizard", "Fire", "Flying"),
    (7, "Squirtle", "Water", None),
    (8, "Wartortle", "Water", None),
    (9, "Blastoise", "Water", None),
    (10, "Caterpie", "Bug", None),
    (11, "Metapod", "Bug", None),
    (12, "Butterfree", "Bug", "Flying"),
    (13, "Weedle", "Bug", "Poison"),
    (14, "Kakuna", "Bug", "Poison"),
    (15, "Beedrill", "Bug", "Poison"),
    (16, "Pidgey", "Normal", "Flying"),
    (17, "Pidgeotto", "Normal", "Flying"),
    (18, "Pidgeot", "Normal", "Flying"),
    (19, "Rattata", "Normal", None),
    (20, "Raticate", "Normal", None),
    (21, "Spearow", "Normal", "Flying"),
    (22, "Fearow", "Normal", "Flying"),
    (23, "Ekans", "Poison", None),
    (24, "Arbok", "Poison", None),
    (25, "Pikachu", "Electric", None),
    (26, "Raichu", "Electric", None),
    (27, "Sandshrew", "Ground", None),
    (28, "Sandslash", "Ground", None),
    (29, "Nidoran\u2642", "Poison", None),
    (30, "Nidorina", "Poison", None),
    (31, "Nidoqueen", "Poison", "Ground"),
    (32, "Nidoran\u2640", "Poison", None),
    (33, "Nidorino", "Poison", None),
    (34, "Nidoking", "Poison", "Ground"),
    (35, "Clefairy", "Fairy", None),
    (36, "Clefable", "Fairy", None),
    (37, "Vulpix", "Fire", None),
    (38, "Ninetales", "Fire", None),
    (39, "Jigglypuff", "Normal", "Fairy"),
    (40, "Wigglytuff", "Normal", "Fairy"),
    (41, "Zubat", "Poison", "Flying"),
    (42, "Golbat", "Poison", "Flying"),
    (43, "Oddish", "Grass", "Poison"),
    (44, "Gloom", "Grass", "Poison"),
    (45, "Vileplume", "Grass", "Poison"),
    (46, "Paras", "Bug", "Grass"),
    (47, "Parasect", "Bug", "Grass"),
    (48, "Venonat", "Bug", "Poison"),
    (49, "Venomoth", "Bug", "Poison"),
    (50, "Diglett", "Ground", None),
    (51, "Dugtrio", "Ground", None),
    (52, "Meowth", "Normal", None),
    (53, "Persian", "Normal", None),
    (54, "Psyduck", "Water", None),
    (55, "Golduck", "Water", None),
    (56, "Mankey", "Fighting", None),
    (57, "Primeape", "Fighting", None),
    (58, "Growlithe", "Fire", None),
    (59, "Arcanine", "Fire", None),
    (60, "Poliwag", "Water", None),
    (61, "Poliwhirl", "Water", None),
    (62, "Poliwrath", "Water", "Fighting"),
    (63, "Abra", "Psychic", None),
    (64, "Kadabra", "Psychic", None),
    (65, "Alakazam", "Psychic", None),
    (66, "Machop", "Fighting", None),
    (67, "Machoke", "Fighting", None),
    (68, "Machamp", "Fighting", None),
    (69, "Bellsprout", "Grass", "Poison"),
    (70, "Weepinbell", "Grass", "Poison"),
    (71, "Victreebel", "Grass", "Poison"),
    (72, "Tentacool", "Water", "Poison"),
    (73, "Tentacruel", "Water", "Poison"),
    (74, "Geodude", "Rock", "Ground"),
    (75, "Graveler", "Rock", "Ground"),
    (76, "Golem", "Rock", "Ground"),
    (77, "Ponyta", "Fire", None),
    (78, "Rapidash", "Fire", None),
    (79, "Slowpoke", "Water", "Psychic"),
    (80, "Slowbro", "Water", "Psychic"),
    (81, "Magnemite", "Electric", "Steel"),
    (82, "Magneton", "Electric", "Steel"),
    (83, "Farfetch'd", "Normal", "Flying"),
    (84, "Doduo", "Normal", "Flying"),
    (85, "Dodrio", "Normal", "Flying"),
    (86, "Seel", "Water", None),
    (87, "Dewgong", "Water", "Ice"),
    (88, "Grimer", "Poison", None),
    (89, "Muk", "Poison", None),
    (90, "Shellder", "Water", None),
    (91, "Cloyster", "Water", "Ice"),
    (92, "Gastly", "Ghost", "Poison"),
    (93, "Haunter", "Ghost", "Poison"),
    (94, "Gengar", "Ghost", "Poison"),
    (95, "Onix", "Rock", "Ground"),
    (96, "Drowzee", "Psychic", None),
    (97, "Hypno", "Psychic", None),
    (98, "Krabby", "Water", None),
    (99, "Kingler", "Water", None),
    (100, "Voltorb", "Electric", None),
    (101, "Electrode", "Electric", None),
    (102, "Exeggcute", "Grass", "Psychic"),
    (103, "Exeggutor", "Grass", "Psychic"),
    (104, "Cubone", "Ground", None),
    (105, "Marowak", "Ground", None),
    (106, "Hitmonlee", "Fighting", None),
    (107, "Hitmonchan", "Fighting", None),
    (108, "Lickitung", "Normal", None),
    (109, "Koffing", "Poison", None),
    (110, "Weezing", "Poison", None),
    (111, "Rhyhorn", "Ground", "Rock"),
    (112, "Rhydon", "Ground", "Rock"),
    (113, "Chansey", "Normal", None),
    (114, "Tangela", "Grass", None),
    (115, "Kangaskhan", "Normal", None),
    (116, "Horsea", "Water", None),
    (117, "Seadra", "Water", None),
    (118, "Goldeen", "Water", None),
    (119, "Seaking", "Water", None),
    (120, "Staryu", "Water", None),
    (121, "Starmie", "Water", "Psychic"),
    (122, "Mr. Mime", "Psychic", "Fairy"),
    (123, "Scyther", "Bug", "Flying"),
    (124, "Jynx", "Ice", "Psychic"),
    (125, "Electabuzz", "Electric", None),
    (126, "Magmar", "Fire", None),
    (127, "Pinsir", "Bug", None),
    (128, "Tauros", "Normal", None),
    (129, "Magikarp", "Water", None),
    (130, "Gyarados", "Water", "Flying"),
    (131, "Lapras", "Water", "Ice"),
    (132, "Ditto", "Normal", None),
    (133, "Eevee", "Normal", None),
    (134, "Vaporeon", "Water", None),
    (135, "Jolteon", "Electric", None),
    (136, "Flareon", "Fire", None),
    (137, "Porygon", "Normal", None),
    (138, "Omanyte", "Rock", "Water"),
    (139, "Omastar", "Rock", "Water"),
    (140, "Kabuto", "Rock", "Water"),
    (141, "Kabutops", "Rock", "Water"),
    (142, "Aerodactyl", "Rock", "Flying"),
    (143, "Snorlax", "Normal", None),
    (144, "Articuno", "Ice", "Flying"),
    (145, "Zapdos", "Electric", "Flying"),
    (146, "Moltres", "Fire", "Flying"),
    (147, "Dratini", "Dragon", None),
    (148, "Dragonair", "Dragon", None),
    (149, "Dragonite", "Dragon", "Flying"),
    (150, "Mewtwo", "Psychic", None),
    (151, "Mew", "Psychic", None),
]

# ─── Authors ────────────────────────────────────────────────────────────────
AUTHORS = [
    {"id": "auth-001", "name": "Ash Ketchum", "seed": "Ash",
     "email": "ash.ketchum@pallettown.com",
     "bio": "Pokemon Master in training from Pallet Town"},
    {"id": "auth-002", "name": "Professor Oak", "seed": "Oak",
     "email": "samuel.oak@lab.kanto.com",
     "bio": "Kanto's leading Pokemon researcher"},
    {"id": "auth-003", "name": "Nurse Joy", "seed": "Joy",
     "email": "joy@poke-center.com",
     "bio": "Head Nurse at the Pokemon Center"},
    {"id": "auth-004", "name": "Gary Oak", "seed": "Gary",
     "email": "blue.oak@victory.com",
     "bio": "Pokemon League Champion and rival"},
    {"id": "auth-005", "name": "Bill the PC Guy", "seed": "Bill",
     "email": "bill@pc-storage.com",
     "bio": "Creator of the Pokemon Storage System"},
    {"id": "auth-006", "name": "Misty", "seed": "Misty",
     "email": "misty@ceruleangym.com",
     "bio": "Cerulean City Gym Leader and Water-type expert"},
    {"id": "auth-007", "name": "Brock", "seed": "Brock",
     "email": "brock@pewtergym.com",
     "bio": "Pewter City Gym Leader and Pokemon breeder"},
    {"id": "auth-008", "name": "Lorelei", "seed": "Lorelei",
     "email": "lorelei@elite4.com",
     "bio": "Elite Four member specializing in Ice-type Pokemon"},
    {"id": "auth-009", "name": "Bruno", "seed": "Bruno",
     "email": "bruno@elite4.com",
     "bio": "Elite Four master of Fighting-type Pokemon"},
    {"id": "auth-010", "name": "Agatha", "seed": "Agatha",
     "email": "agatha@elite4.com",
     "bio": "Elite Four Ghost-type specialist"},
    {"id": "auth-011", "name": "Lance", "seed": "Lance",
     "email": "lance@elite4.com",
     "bio": "Elite Four Dragon-type champion"},
    {"id": "auth-012", "name": "Jessie", "seed": "Jessie",
     "email": "jessie@teamrocket.com",
     "bio": "Team Rocket agent - Prepare for trouble!"},
    {"id": "auth-013", "name": "James", "seed": "James",
     "email": "james@teamrocket.com",
     "bio": "Team Rocket agent - And make it double!"},
    {"id": "auth-014", "name": "Blaine", "seed": "Blaine",
     "email": "blaine@cinnabargym.com",
     "bio": "Cinnabar Island Gym Leader and quiz master"},
    {"id": "auth-015", "name": "Sabrina", "seed": "Sabrina",
     "email": "sabrina@saffronGym.com",
     "bio": "Saffron City Gym Leader - the mind reading Psi Master"},
]

# ─── Type Descriptions for Pokemon Blog Content ────────────────────────────
TYPE_LORE = {
    "Fire": {"element": "flames", "strength": "burning intensity", "habitat": "volcanic regions",
             "counter": "Water", "weakness": "gets extinguished easily"},
    "Water": {"element": "tides", "strength": "unstoppable flow", "habitat": "oceans and rivers",
              "counter": "Grass", "weakness": "evaporates under pressure"},
    "Grass": {"element": "nature", "strength": "regenerative growth", "habitat": "forests and meadows",
              "counter": "Fire", "weakness": "wilters in drought"},
    "Electric": {"element": "lightning", "strength": "split-second speed", "habitat": "power plants",
                 "counter": "Ground", "weakness": "grounded easily"},
    "Psychic": {"element": "mind", "strength": "telekinetic power", "habitat": "ancient ruins",
                "counter": "Bug", "weakness": "overwhelmed by raw instinct"},
    "Ghost": {"element": "shadows", "strength": "phase through matter", "habitat": "abandoned towers",
              "counter": "Normal", "weakness": "fades in bright light"},
    "Dragon": {"element": "ancient power", "strength": "devastating attacks", "habitat": "sky pillars",
               "counter": "Ice", "weakness": "loses to the cold"},
    "Bug": {"element": "swarms", "strength": "overwhelming numbers", "habitat": "forests",
            "counter": "Fire", "weakness": "fragile individually"},
    "Poison": {"element": "toxic", "strength": "status attrition", "habitat": "swamps",
               "counter": "Psychic", "weakness": "purified easily"},
    "Ground": {"element": "earth", "strength": "seismic force", "habitat": "caves and deserts",
               "counter": "Grass", "weakness": "immobilized by water"},
    "Rock": {"element": "stone", "strength": "immovable defense", "habitat": "mountains",
             "counter": "Water", "weakness": "eroded over time"},
    "Ice": {"element": "frost", "strength": "freezing control", "habitat": "tundra",
            "counter": "Fire", "weakness": "melts under heat"},
    "Fighting": {"element": "martial", "strength": "raw physical power", "habitat": "dojos",
                 "counter": "Psychic", "weakness": "outsmarted easily"},
    "Normal": {"element": "versatility", "strength": "adaptable moveset", "habitat": "everywhere",
               "counter": "Fighting", "weakness": "lacks speciality"},
    "Flying": {"element": "sky", "strength": "aerial superiority", "habitat": "mountaintops",
               "counter": "Electric", "weakness": "grounded by storms"},
    "Fairy": {"element": "magic", "strength": "enchanting power", "habitat": "enchanted forests",
              "counter": "Poison", "weakness": "overcome by toxins"},
    "Steel": {"element": "metal", "strength": "impenetrable armor", "habitat": "factories",
              "counter": "Fire", "weakness": "rusts over time"},
}

# ─── Blog Post Templates ──────────────────────────────────────────────────
def get_author_rotation():
    """Rotate authors based on Pokemon type expertise."""
    type_author_map = {
        "Fire": ["auth-001", "auth-014"],      # Ash, Blaine
        "Water": ["auth-006", "auth-003"],      # Misty, Nurse Joy
        "Grass": ["auth-002", "auth-007"],      # Oak, Brock
        "Electric": ["auth-001", "auth-004"],   # Ash, Gary
        "Psychic": ["auth-015", "auth-011"],    # Sabrina, Lance
        "Ghost": ["auth-010", "auth-004"],      # Agatha, Gary
        "Dragon": ["auth-011", "auth-001"],     # Lance, Ash
        "Bug": ["auth-002", "auth-005"],        # Oak, Bill
        "Poison": ["auth-012", "auth-002"],     # Jessie, Oak
        "Ground": ["auth-007", "auth-009"],     # Brock, Bruno
        "Rock": ["auth-007", "auth-014"],       # Brock, Blaine
        "Ice": ["auth-008", "auth-006"],        # Lorelei, Misty
        "Fighting": ["auth-009", "auth-007"],   # Bruno, Brock
        "Normal": ["auth-005", "auth-003"],     # Bill, Nurse Joy
        "Flying": ["auth-004", "auth-011"],     # Gary, Lance
        "Fairy": ["auth-006", "auth-003"],      # Misty, Nurse Joy
        "Steel": ["auth-005", "auth-014"],      # Bill, Blaine
    }
    return type_author_map


def pick_author(pokemon_id, primary_type):
    """Pick an author based on type, with slight rotation."""
    author_map = get_author_rotation()
    candidates = author_map.get(primary_type, ["auth-001"])
    # Simple rotation: even IDs get first, odd get second
    idx = 0 if pokemon_id % 2 == 0 else 1
    if idx >= len(candidates):
        idx = 0
    return candidates[idx]


def get_author_info(author_id):
    """Get author dict from AUTHORS list."""
    for a in AUTHORS:
        if a["id"] == author_id:
            return a
    return AUTHORS[0]


def generate_blog_html(num, name, primary, secondary):
    """Generate unique blog HTML for each Pokemon."""
    lore = TYPE_LORE.get(primary, TYPE_LORE["Normal"])
    type_str = f"{primary}/{secondary}" if secondary else primary

    # Intro templates based on number ranges
    if num <= 3:
        intro = f"<h2>The Beginning of Everything</h2><p>Professor Oak's research into {name} has revealed incredible insights into the {primary.lower()} types of the Kanto region.</p>"
    elif num <= 9:
        intro = f"<h2>Partner Potential</h2><p>Every trainer in Pallet Town dreams of starting their journey with {name}.</p>"
    elif num <= 25:
        intro = f"<h2>Common but Remarkable</h2><p>Don't let {name}'s common appearance fool you - this Pokemon is full of surprises.</p>"
    elif num <= 50:
        intro = f"<h2>The Underestimated</h2><p>Many trainers overlook {name}, but those who train it discover its true potential.</p>"
    elif num <= 100:
        intro = f"<h2>Mid-Journey Discovery</h2><p>By the time trainers reach the middle routes of Kanto, {name} becomes an essential encounter.</p>"
    elif num <= 143:
        intro = f"<h2>Rare Sighting</h2><p>Encountering {name} in the wild is a privilege few trainers experience.</p>"
    else:
        intro = f"<h2>Legendary Power</h2><p>{name} represents the pinnacle of Pokemon evolution and power.</p>"

    # Type-specific content
    primary_lower = primary.lower()
    desc_parts = [
        f"<h2>Type Analysis: {type_str}</h2>",
        f"<p>As a {type_str} type, {name} channels the power of {lore['element']}. "
        f"Its greatest strength lies in {lore['strength']}, making it a formidable opponent "
        f"when trained properly.</p>",
    ]

    # Habitat/battle info
    desc_parts.append(
        f"<h3>Habitat and Behavior</h3>"
        f"<p>{name} is commonly found in {lore['habitat']} of the Kanto region. "
        f"Trainers should be prepared for a challenging encounter.</p>"
    )

    # Weaknesses
    desc_parts.append(
        f"<h3>Weaknesses to Watch</h3>"
        f"<p>Every Pokemon has vulnerabilities. {name} {lore['weakness']}. "
        f"A smart opponent will exploit this weakness to {lore['counter']}-type attacks.</p>"
    )

    # Training tips
    if primary in ("Fire", "Water", "Grass"):
        desc_parts.append(
            f"<h3>Training Tips</h3>"
            f"<p>{name} excels in balanced team compositions. "
            f"Pair it with a strong {lore['counter']}-type counter to cover its weakness. "
            f"The Kanto League rewards trainers who understand type matchups.</p>"
        )
    elif primary in ("Psychic", "Dragon", "Ghost"):
        desc_parts.append(
            f"<h3>Elite Training</h3>"
            f"<p>{name} requires advanced training techniques. "
            f"Study under experts like the Elite Four to master its {lore['strength']}.</p>"
        )
    else:
        desc_parts.append(
            f"<h3>Training Tips</h3>"
            f"<p>Patience is key with {name}. "
            f"Focus on building {lore['strength']} through consistent battles "
            f"across Kanto's diverse gyms.</p>"
        )

    return intro + "".join(desc_parts)


def slugify(name, num):
    """Create URL-friendly slug."""
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return f"pokemon-{num:03d}-{slug}"


def generate_seed_data():
    """Generate complete seed data with 151 Pokemon blogs."""
    blogs = []
    base_ts = SEED_TIMESTAMP

    for num, name, primary, secondary in POKEMON:
        author_id = pick_author(num, primary)
        author_info = get_author_info(author_id)
        slug = slugify(name, num)
        html = generate_blog_html(num, name, primary, secondary)
        is_featured = (num == 25)  # Pikachu is featured

        blog = {
            "id": f"pokemon-{num:03d}",
            "title": f"Pokemon #{num}: {name} - The {primary} Type {('Expert' if not secondary else f'Master')}",
            "description": html,
            "slug": slug,
            "category": primary,
            "tags": f"{primary.lower()}, kanto, pokemon, generation-1" + (f", {secondary.lower()}" if secondary else ""),
            "meta_title": f"{name} - Pokemon #{num} Guide",
            "meta_keywords": f"{name}, Pokemon {num}, {primary} type, Kanto Pokedex, Pokemon guide",
            "meta_description": f"Complete guide to {name} (#{num}) - a {primary} type Pokemon from the Kanto region. Learn about its strengths, weaknesses, and training tips.",
            "author": {
                "authorId": author_id,
                "name": author_info["name"],
                "url": f"https://api.dicebear.com/7.x/pixel-art/jpg?seed={author_info['seed']}"
            },
            "images": {
                "name": name,
                "url": f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{num}.png"
            },
            "cover_alt": None,
            "faq_heading": None,
            "faqs": None,
            "redirect_url": None,
            "site_id": "site-id-1",
            "featured": is_featured,
            "created_at": base_ts - (num * 3600000),  # Spread timestamps
            "updated_at": base_ts,
        }
        blogs.append(blog)

    return blogs


def generate_categories():
    """Generate categories for all types used."""
    seen = set()
    cats = []
    cat_id = 1
    for _, _, primary, secondary in POKEMON:
        for t in (primary, secondary):
            if t and t not in seen:
                seen.add(t)
                cats.append({
                    "id": f"cat-gen1-{cat_id:03d}",
                    "category_name": t,
                    "site_id": "site-id-1",
                    "created_at": SEED_TIMESTAMP,
                    "updated_at": SEED_TIMESTAMP,
                })
                cat_id += 1
    return cats


def generate_tags():
    """Generate type-based tags."""
    type_tags = [
        "generation-1", "kanto", "pokemon", "retro-gaming", "nintendo",
        "fire", "water", "grass", "electric", "psychic", "ghost", "dragon",
        "bug", "poison", "ground", "rock", "ice", "fighting", "normal",
        "flying", "fairy", "steel",
    ]
    tags = []
    for i, tag in enumerate(type_tags):
        tags.append({
            "id": f"tag-gen1-{i+1:03d}",
            "tag_name": tag,
            "site_id": "site-id-1",
            "created_at": SEED_TIMESTAMP,
            "updated_at": SEED_TIMESTAMP,
        })
    return tags


if __name__ == "__main__":
    blogs = generate_seed_data()
    categories = generate_categories()
    tags = generate_tags()

    # Print summary
    print(f"Generated {len(blogs)} blog posts")
    print(f"Generated {len(categories)} categories")
    print(f"Generated {len(tags)} tags")

    # Author distribution
    from collections import Counter
    author_counts = Counter(b["author"]["name"] for b in blogs)
    print("\nAuthor distribution:")
    for author, count in author_counts.most_common():
        print(f"  {author}: {count} posts")

    # Type distribution
    type_counts = Counter(b["category"] for b in blogs)
    print(f"\nType distribution ({len(type_counts)} types):")
    for t, count in type_counts.most_common():
        print(f"  {t}: {count}")
