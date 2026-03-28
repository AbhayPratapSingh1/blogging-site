export const writeres = [
  {
    name: "Pikachu",
    email: "pika.pika@kanto.com",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    profilePic: { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" }
  },
  {
    name: "Bugs Bunny",
    email: "bugs.bunny@looneytunes.com",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    profilePic: { url: "https://upload.wikimedia.org/wikipedia/en/1/17/Bugs_Bunny.svg" }
  },
  {
    name: "Charizard",
    email: "flamethrower99@kanto.com",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    profilePic: { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" }
  },
  {
    name: "Mickey Mouse",
    email: "mickey@disney.com",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    profilePic: { url: "https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png" }
  },
  {
    name: "Gengar",
    email: "shadow.ball@johto.com",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    profilePic: { url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" }
  }
]

export const featuredPost = {
  category: "Gaming",
  slug: "evolution-of-kanto",
  images: {
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    name: "Dragonite"
  },
  title: "The Ultimate Guide to Dragon-Type Mastery",
  author: {
    name: "Ash Ketchum",
    type: "Pokémon Master",
    url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Bill"
  },
  createdAt: new Date().getTime(),
  tags: "pokemon, nintendo, retro-gaming"
}

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


export const categories = [
  { categoryName: "Legendary" },
  { categoryName: "Starters" },
  { categoryName: "Ghost Type" },
  { categoryName: "Evolution" }
]


export const blogs = [
  {
    category: "Legendary",
    slug: "mewtwo-strikes-back",
    author: {
      name: "Professor Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak"
    },
    tags: "Psychic, Kanto, Legendary-Research",
    createdAt: new Date().getTime(),
    images: {
      name: "Mewtwo Artwork",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
    },
    title: "Understanding the Genetic Power of Mewtwo"
  },
  {
    category: "Starters",
    slug: "choosing-your-first-partner",
    author: {
      name: "Nurse Joy",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Joy"
    },
    tags: "Fire, Water, Grass, Beginner-Guide",
    createdAt: new Date().getTime(),
    images: {
      name: "Kanto Starters",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
    },
    title: "Fire, Water, or Grass: Who Should You Choose?"
  },
  {
    category: "Ghost Type",
    slug: "haunted-lavender-town",
    author: {
      name: "Gary Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Gary"
    },
    tags: "Ghost, Horror, Lavender-Town",
    createdAt: new Date().getTime(),
    images: {
      name: "Gengar Shadow",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
    },
    title: "The Mysteries of the Lavender Town Radio Tower"
  },
  {
    category: "Evolution",
    slug: "eevee-evolution-guide",
    author: {
      name: "Bill the PC Guy",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Bill"
    },
    tags: "Eevee, Evolution, Elemental-Stones",
    createdAt: new Date().getTime(),
    images: {
      name: "Eevee Family",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
    },
    title: "How to Evolve Your Eevee into Eight Different Types"
  }
]