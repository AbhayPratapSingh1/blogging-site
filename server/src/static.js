
export const authors = [
  {
    _id: "auth-001",
    name: "Ash Ketchum",
    email: "ash.ketchum@pallettown.com",
    createdAt: 1711639978000,
    updatedAt: 1711639978000,
    profilePic: { url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Ash" }
  },
  {
    _id: "auth-002",
    name: "Professor Oak",
    email: "samuel.oak@lab.kanto.com",
    createdAt: 1711639978000,
    updatedAt: 1711639978000,
    profilePic: { url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak" }
  },
  {
    _id: "auth-003",
    name: "Nurse Joy",
    email: "joy@poke-center.com",
    createdAt: 1711639978000,
    updatedAt: 1711639978000,
    profilePic: { url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Joy" }
  },
  {
    _id: "auth-004",
    name: "Gary Oak",
    email: "blue.oak@victory.com",
    createdAt: 1711639978000,
    updatedAt: 1711639978000,
    profilePic: { url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Gary" }
  },
  {
    _id: "auth-005",
    name: "Bill the PC Guy",
    email: "bill@pc-storage.com",
    createdAt: 1711639978000,
    updatedAt: 1711639978000,
    profilePic: { url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Bill" }
  }
];

export const featuredBlog = {
  _id: "feat-101",
  category: "Gaming",
  slug: "evolution-of-kanto",
  images: {
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    name: "Dragonite"
  },
  title: "The Ultimate Guide to Dragon-Type Mastery",
  author: {
    authorId: "auth-001",
    name: "Ash Ketchum",
    type: "Pokémon Master",
    url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Ash"
  },
  createdAt: 1711639978000,
  tags: "pokemon, nintendo, retro-gaming"
}

export const blogs = [
  {
    _id: "blog-001",
    category: "Legendary",
    slug: "mewtwo-strikes-back",
    author: {
      authorId: "auth-002", // Moved here
      name: "Professor Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak"
    },
    tags: "Psychic, Kanto, Legendary-Research",
    createdAt: 1711639978000,
    images: {
      name: "Mewtwo Artwork",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
    },
    title: "Understanding the Genetic Power of Mewtwo"
  },
  {
    _id: "blog-002",
    category: "Starters",
    slug: "choosing-your-first-partner",
    author: {
      authorId: "auth-003",
      name: "Nurse Joy",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Joy"
    },
    tags: "Fire, Water, Grass, Beginner-Guide",
    createdAt: 1711639978000,
    images: {
      name: "Kanto Starters",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
    },
    title: "Fire, Water, or Grass: Who Should You Choose?"
  },
  {
    _id: "blog-003",
    category: "Ghost Type",
    slug: "haunted-lavender-town",
    author: {
      authorId: "auth-004",
      name: "Gary Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Gary"
    },
    tags: "Ghost, Horror, Lavender-Town",
    createdAt: 1711639978000,
    images: {
      name: "Gengar Shadow",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
    },
    title: "The Mysteries of the Lavender Town Radio Tower"
  },
  {
    _id: "blog-004",
    category: "Evolution",
    slug: "eevee-evolution-guide",
    author: {
      authorId: "auth-005",
      name: "Bill the PC Guy",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Bill"
    },
    tags: "Eevee, Evolution, Elemental-Stones",
    createdAt: 1711639978000,
    images: {
      name: "Eevee Family",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
    },
    title: "How to Evolve Your Eevee into Eight Different Types"
  },
  {
    _id: "blog-005",
    category: "History",
    slug: "ancient-ruins-of-alph",
    author: {
      authorId: "auth-002",
      name: "Professor Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak"
    },
    tags: "Unown, Johto, Archaeology",
    createdAt: 1711641200000,
    images: {
      name: "Unown Symbols",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png"
    },
    title: "Deciphering the Secrets of the Ruins of Alph"
  },
  {
    _id: "blog-006",
    category: "Competitive",
    slug: "gym-leader-strategies",
    author: {
      authorId: "auth-004",
      name: "Gary Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Gary"
    },
    tags: "Badges, Strategy, Elite-Four",
    createdAt: 1711642500000,
    images: {
      name: "Blastoise Might",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
    },
    title: "Why Most Trainers Fail at the Third Gym"
  },
  {
    _id: "blog-007",
    category: "Speedrunning",
    slug: "fastest-kanto-clear",
    author: {
      authorId: "auth-001",
      name: "Ash Ketchum",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Ash"
    },
    tags: "Speedrun, Glitches, Records",
    createdAt: 1711643800000,
    images: {
      name: "Arcanine Speed",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png"
    },
    title: "Breaking the 2-Hour Barrier in Kanto"
  }
];

export const pageMetaData = {
  home: {
    metaTitle: "Gotta Catch 'Em All | Ultimate Pokémon Strategy & News",
    metaKeywords: "Pokémon; Pokedex; Gaming News; Nintendo Switch; Strategy Guide",
    metaDescription: "Your premier destination for the latest Pokémon battle strategies, regional guides, and breaking news from the world of Nintendo gaming.",
  },
  blog: {
    metaTitle: "The Trainer's Journal | Latest Articles & Tips",
    metaKeywords: "Pokémon Blog; Game Reviews; Leveling Guide; Shiny Hunting",
    metaDescription: "Deep dives into game mechanics, hidden secrets, and community stories from across the Pokémon universe.",
  },
  contact: {
    metaTitle: "Contact the Gym Leader | Get in Touch",
    metaKeywords: "Support; Collaboration; Gaming Community; Inquiry",
    metaDescription: "Have a tip or a question? Reach out to our team of experts and join the conversation today.",
  }
};