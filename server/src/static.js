
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
    metaKeywords: "Pokémon, Pokedex, Gaming News, Nintendo Switch, Strategy Guide",
    metaDescription: "Your premier destination for the latest Pokémon battle strategies, regional guides, and breaking news from the world of Nintendo gaming.",
  },
  "about": {
    title: "About Our Pokémon Research Journey",
    excerpt: "Founded in Pallet Town, we are dedicated to documenting every species across the Kanto and Johto regions.",
    publishedAt: "2024-03-28T10:00:00Z",
    coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png" // Mew (Research Theme)
  },
  "privacy": {
    title: "Privacy Policy | Trainer Data Protection",
    excerpt: "Your Trainer ID and location data are guarded as securely as a Master Ball. Learn about our encryption standards.",
    publishedAt: "2024-03-28T10:00:00Z",
    coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png" // Electrode (Security Theme)
  },
  "contact-us": {
    title: "Contact Us | Reach the Research Lab",
    excerpt: "Have a question about an evolution or a gym leader strategy? Connect with our Professors via digital portal.",
    publishedAt: "2024-03-28T10:00:00Z",
    coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png" // Pidgey (Messenger Theme)
  },
  "blog": {
    title: "The Trainer's Journal | Latest Articles & Tips",
    excerpt: "Deep dives into game mechanics, hidden secrets, and community stories from across the Pokémon universe.",
    publishedAt: "2024-03-28T10:00:00Z",
    coverImage: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" // Pikachu
  }
};


export const staticPageLinks = [
  { name: "About", link: "/about" },
  { name: "Privacy Policy", link: "/privacy" },
  { name: "Contact Us", link: "/contact-us" },
]

export const staticPages = {
  "about": {
    title: "About Us",
    description: `
      <section>
        <h2>The Journey of a Pokémon Master</h2>
        <p>Founded in <strong>Pallet Town</strong>, our mission is to provide the most comprehensive research and news across the Kanto and Johto regions.</p>
        <p>Whether you're a beginner starting with your first partner or an Elite Four contender, we're here to help you catch 'em all. Our team of dedicated Professors works around the clock to document every species and battle strategy known to the Pokémon world.</p>
        <ul>
          <li>Expert Battle Strategies</li>
          <li>Regional Pokedex Research</li>
          <li>Gym Leader Guides</li>
        </ul>
      </section>
    `,
  },
  "privacy": {
    title: "Privacy Policy",
    description: `
      <section>
        <h2>Your data is as safe as a Master Ball</h2>
        <p>At our Research Lab, we take your privacy seriously. Your Trainer ID, location data, and party information are strictly confidential.</p>
        <p>We ensure that:</p>
        <ul>
          <li>Your data is never shared with <strong>Team Rocket</strong> or third-party organizations.</li>
          <li>End-to-end encryption is used on all Pokedex syncs.</li>
          <li>You have full control over your profile visibility in the Global Trade System (GTS).</li>
        </ul>
        <p>By using our services, you agree to the Trainer Privacy Code of Conduct.</p>
      </section>
    `,
  },
  "contact-us": {
    title: "Get in Touch",
    description: `
      <section>
        <h2>Visit any Pokémon Center or message us here</h2>
        <p>Have a question about a specific evolution or a bug in your PC storage system? Our help desk is open 24/7 across all major cities.</p>
        <p><strong>Contact Methods:</strong></p>
        <ul>
          <li><strong>Pidgey Express:</strong> Send a letter to the Pallet Town Research Lab.</li>
          <li><strong>Digital Portal:</strong> Use any PC in a Pokémon Center to reach our support team.</li>
          <li><strong>Video Call:</strong> Available via the Xtransceiver for registered Trainers.</li>
        </ul>
        <p>We usually respond within one business day (unless we're currently in a Gym Battle).</p>
      </section>
    `,
  }
}