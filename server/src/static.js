
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
  description: "Join Ash Ketchum as he breaks down the training secrets and sheer power behind the Kanto region's most iconic Dragon-type, Dragonite.",
  author: {
    authorId: "auth-001",
    name: "Ash Ketchum",
    type: "Pokémon Master",
    url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Ash"
  },
  createdAt: 1711639978000,
  tags: "pokemon, nintendo, retro-gaming"
}

export const blogs = {
  "evolution-of-kanto": {
    _id: "feat-101",
    category: "Gaming",
    slug: "evolution-of-kanto",
    metadata: {
      title: "Evolution Of Kanto",
      keywords: "Dragonite, Dragon-type mastery, Kanto Pokemon, Ash Ketchum training",
      description: "Join Ash Ketchum as he breaks down the training secrets and sheer power behind the Kanto region's most iconic Dragon-type, Dragonite.",
    },
    author: {
      authorId: "auth-001",
      name: "Ash Ketchum",
      type: "Pokémon Master",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Ash"
    },
    tags: "pokemon, nintendo, retro-gaming",
    createdAt: 1711639978000,
    images: {
      name: "Dragonite",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png"
    },
    title: "The Ultimate Guide to Dragon-Type Mastery",
    description: `
    <h2>Unleashing the Dragon</h2>
    <p>When it comes to the Kanto region, there isn't a Pokémon that commands respect quite like Dragonite. It’s not just about the raw power; it’s about the bond you build during those long hours of training!</p>
    <h3>Why Dragonite Rules the Skies</h3>
    <ul>
      <li><strong>Extreme Speed:</strong> It can fly around the globe in just 16 hours.</li>
      <li><strong>Versatile Movepool:</strong> From Hyper Beam to Dragon Claw, it handles any threat.</li>
      <li><strong>Inner Focus:</strong> A true champion never flinches in the heat of battle!</li>
    </ul>
    <p>Training a Dratini all the way to its final form takes patience, but seeing that orange wingspan for the first time makes every battle worth it. Let’s get out there and become Masters!</p>
  `
  },
  "mewtwo-strikes-back": {
    _id: "blog-001",
    category: "Legendary",
    slug: "mewtwo-strikes-back",
    metadata: {
      title: "Mewtwo Strikes Back",
      keywords: "Mewtwo, Psychic Pokemon, Legendary Research, Pokemon Cloning, Professor Oak",
      description: "Explore the biological superiority and ethical dilemmas behind the creation of Mewtwo, the world's strongest Psychic-type.",
    },
    author: {
      authorId: "auth-002",
      name: "Professor Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak"
    },
    tags: "Psychic, Kanto, Legendary-Research",
    createdAt: 1711639978000,
    images: {
      name: "Mewtwo Artwork",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
    },
    title: "Understanding the Genetic Power of Mewtwo",
    description: `
      <h2>The Ethics of Cloning</h2>
      <p>Mewtwo remains the most ambitious and controversial project in the history of Pokémon biology. Created from the DNA of Mew, this entity was designed to surpass its predecessor in every measurable way.</p>
      <h3>Biological Superiority</h3>
      <ul>
        <li>Psychic output exceeding 10,000 gigajoules.</li>
        <li>Rapid cellular regeneration capabilities.</li>
        <li>Enhanced cognitive processing beyond human levels.</li>
      </ul>
      <p>However, the question remains: does power define a Pokémon, or is it the heart of the trainer?</p>
    `
  },
  "choosing-your-first-partner": {
    _id: "blog-002",
    category: "Starters",
    slug: "choosing-your-first-partner",
    metadata: {
      title: "Choosing Your First Partner",
      keywords: "Kanto Starters, Bulbasaur, Charmander, Squirtle, Pokemon Beginner Guide",
      description: "A comprehensive guide for new trainers on selecting their first partner: Bulbasaur, Charmander, or Squirtle.",
    },
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
    title: "Fire, Water, or Grass: Who Should You Choose?",
    description: `
      <h2>A Guide for New Trainers</h2>
      <p>Walking into Professor Oak's lab is a moment you'll never forget. But which Pokéball contains your perfect match?</p>
      <h3>The Triangle of Elements</h3>
      <p><strong>Bulbasaur:</strong> Perfect for those who value defense and status-altering moves early on. <strong>Charmander:</strong> For the bold trainer who wants high offensive power. <strong>Squirtle:</strong> The balanced choice for tactical versatility.</p>
      <p>Remember, your first partner isn't just a tool for battle—they are your lifelong friend.</p>
    `
  },
  "haunted-lavender-town": {
    _id: "blog-003",
    category: "Ghost Type",
    slug: "haunted-lavender-town",
    metadata: {
      title: "Haunted Lavender Town",
      keywords: "Lavender Town, Ghost Pokemon, Gengar, Pokemon Tower, Gary Oak research",
      description: "Investigating the eerie frequencies and ghostly legends surrounding the Lavender Town Radio Tower.",
    },
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
    title: "The Mysteries of the Lavender Town Radio Tower",
    description: `
      <h2>The Haunting Frequencies</h2>
      <p>Don't bother listening to the rumors—listen to the facts. The Lavender Town Radio Tower is built on the site of the original Pokémon Tower, and the energy there is... off.</p>
      <h3>Investigative Findings</h3>
      <p>During my visit, we recorded strange white noise on Channel 20.5. Whether it's the Ghost-types or something more structural, trainers should keep their Silph Scopes ready at all times.</p>
      <p>I didn't see any ghosts, but my Eevee certainly didn't like the basement.</p>
    `
  },
  "eevee-evolution-guide": {
    _id: "blog-004",
    category: "Evolution",
    slug: "eevee-evolution-guide",
    metadata: {
      title: "Eevee Evolution Guide",
      keywords: "Eevee, Eeveelutions, Fire Stone, Water Stone, Thunder Stone, Espeon, Umbreon",
      description: "Learn how to unlock all eight elemental evolutions for Eevee using stones, friendship, and environments.",
    },
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
    title: "How to Evolve Your Eevee into Eight Different Types",
    description: `
      <h2>The Irregular Genetic Code</h2>
      <p>Eevee is a marvel of nature. Its DNA is uniquely unstable, allowing it to mutate based on environmental factors or specific catalysts.</p>
      <h3>Known Evolutionary Paths</h3>
      <ul>
        <li><strong>Stones:</strong> Fire, Water, and Thunder Stones provide instant evolution.</li>
        <li><strong>Bonding:</strong> Friendship levels during day or night cycles trigger Espeon or Umbreon.</li>
        <li><strong>Environment:</strong> Mossy or Icy rocks influence Leafeon and Glaceon.</li>
      </ul>
      <p>Which "Eeveelution" suits your team's strategy best? It all depends on the gaps in your roster.</p>
    `
  },
  "ancient-ruins-of-alph": {
    _id: "blog-005",
    category: "History",
    slug: "ancient-ruins-of-alph",
    metadata: {
      title: "Ancient Ruins Of Alph",
      keywords: "Ruins of Alph, Unown, Johto Archaeology, Pokemon History",
      description: "Uncover the secrets of the Unown and the ancient archaeological puzzles of the Johto region.",
    },
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
    title: "Deciphering the Secrets of the Ruins of Alph",
    description: `
      <h2>A Language Lost to Time</h2>
      <p>The Ruins of Alph represent one of the greatest archaeological puzzles in Johto. The walls are covered in Unown—Pokémon that literally resemble an ancient alphabet.</p>
      <h3>Research Highlights</h3>
      <p>Are the Unown symbols based on human writing, or did humans learn to write by imitating the Unown? My latest research suggests a symbiotic relationship that dates back thousands of years.</p>
      <p>Unlocking the sliding stone puzzles is the only way to reveal the chamber's true purpose.</p>
    `
  },
  "gym-leader-strategies": {
    _id: "blog-006",
    category: "Competitive",
    slug: "gym-leader-strategies",
    metadata: {
      title: "Gym Leader Strategies",
      keywords: "Lt. Surge strategy, Kanto Gym Leaders, Raichu battle, competitive pokemon tips",
      description: "Expert advice on overcoming the difficult mid-game gym leaders and preparing for the Elite Four.",
    },
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
    title: "Why Most Trainers Fail at the Third Gym",
    description: `
      <h2>The Lt. Surge Wall</h2>
      <p>I see it all the time: trainers breeze through Brock and Misty and then get completely shocked—literally—by Lt. Surge. Why? Because they don't understand speed tiers.</p>
      <h3>The Winning Formula</h3>
      <ol>
        <li>Bring a Ground-type (obviously).</li>
        <li>Identify the "Double Team" spam early.</li>
        <li>Don't be afraid to switch out paralyzed Pokémon immediately.</li>
      </ol>
      <p>If you can't handle a Raichu, you have no business challenging the Elite Four. Smell ya later!</p>
    `
  },
  "fastest-kanto-clear": {
    _id: "blog-007",
    category: "Speedrunning",
    slug: "fastest-kanto-clear",
    metadata: {
      title: "Fastest Kanto Clear",
      keywords: "Pokemon Speedrun, Kanto Any%, Nidoking route, Pokemon records",
      description: "Master the tactics required to clear the Kanto region in record-breaking time.",
    },
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
    title: "Breaking the 2-Hour Barrier in Kanto",
    description: `
      <h2>Maximum Velocity</h2>
      <p>When you're aiming for a world record, every frame counts. Forget catching 'em all; we're catching only what we need to reach the Hall of Fame.</p>
      <h3>Key Speedrun Tactics</h3>
      <p>Using Nidoking for its diverse movepool and abusing the 'X-Accuracy' and 'Horn Drill' combo is a staple of the Kanto Any% route. We also use specific menu-buffering to avoid wild encounters.</p>
      <p>It’s a grueling pace, but seeing that timer stop under 1:50:00 is the ultimate rush!</p>
    `
  }
};

export const blogsDetails = [
  {
    _id: "blog-001",
    category: "Legendary",
    slug: "mewtwo-strikes-back",
    author: {
      authorId: "auth-002",
      name: "Professor Oak",
      url: "https://api.dicebear.com/7.x/pixel-art/jpg?seed=Oak"
    },
    tags: "Psychic, Kanto, Legendary-Research",
    createdAt: 1711639978000,
    images: {
      name: "Mewtwo Artwork",
      url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
    },
    title: "Understanding the Genetic Power of Mewtwo",
    description: "Professor Oak explores the ethical and biological implications of the world's most powerful man-made Pokémon."
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
    title: "Fire, Water, or Grass: Who Should You Choose?",
    description: "A kind-hearted guide for new trainers on selecting the partner that best fits their personality and journey style."
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
    title: "The Mysteries of the Lavender Town Radio Tower",
    description: "Gary Oak investigates the chilling urban legends and spectral sightings surrounding the tower of spirits."
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
    title: "How to Evolve Your Eevee into Eight Different Types",
    description: "Master of the PC system and Pokémon researcher Bill explains the complex genetic triggers behind Eevee's many forms."
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
    title: "Deciphering the Secrets of the Ruins of Alph",
    description: "An archaeological deep-dive into the strange Unown symbols and their connection to the Johto region's past."
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
    title: "Why Most Trainers Fail at the Third Gym",
    description: "Think you're ready for Lt. Surge? Gary Oak breaks down why amateur strategies fail and how to win like a champion."
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
    title: "Breaking the 2-Hour Barrier in Kanto",
    description: "Optimization is key. Learn the route and glitches used to clear the original Kanto journey in record-shattering time."
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



export const staticPages = {
  "about": {
    title: "About Us",
    description: `
      <section>
        <h2>HELLO WORLD</h2>
        
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