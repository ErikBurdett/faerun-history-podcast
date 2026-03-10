export type Episode = {
  id: string;
  title: string;
  showName: string;
  publishedDateLabel?: string;
  durationLabel?: string;
  description: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  spotifyUrl: string;
  spotifyEmbedUrl: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedDateLabel: string;
  tags: string[];
  content: Array<
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'ul'; items: string[] }
  >;
};

export type Sponsor = {
  id: string;
  name: string;
  description: string;
  websiteUrl?: string;
};

export const siteInfo = {
  title: 'Tale of the Lich',
  subtitle: 'The Lich’s Tale: A Faerûn Lorecast',
  description:
    'Step into the hidden stacks beneath Waterdeep and listen as a friendly lich guides you through the long memory of Faerûn. The Lich’s Tale: A Faerûn Lorecast is an immersive lore podcast for fans of the Forgotten Realms, Dungeons & Dragons, fantasy history, and deep worldbuilding. Each episode explores the great empires, shattered ages, legendary peoples, gods, cataclysms, and mysteries that shaped the Realms.',
  disclaimerLines: [
    'The Lich’s Tale: A Faerûn Lorecast is a fan-made, unofficial production.',
    'Dungeons & Dragons and Forgotten Realms are trademarks of Wizards of the Coast.',
    'This show is not affiliated with or endorsed by Wizards of the Coast.',
  ],
  contactEmail: 'taleofthelich@gmail.com',
  externalLinks: {
    spotifyEpisode:
      'https://open.spotify.com/episode/1ynlyPCiOPzbdXMv2SfaQE?si=5867a8651df34806',
    spotifyShowEmbed:
      'https://open.spotify.com/embed/show/3GWoDkvK7pofoGGiVNnjwp?utm_source=generator&theme=0',
    shop: 'https://www.printful.com/',
    officialSite: 'https://taleofthelich.com',
  },
  host: {
    name: 'Erilian Canternine',
    title: 'Baelnorn lich • Lorekeeper',
    profile:
      'Erilian is Candlekeep’s patient curator: a careful voice, a sharp memory, and an incurable affection for footnotes, marginalia, and ruined dynasties.',
    history: [
      'Erilian Canternine was once an elven scholar who watched libraries burn and names vanish from the record. He learned the hard way that history doesn’t “survive” — it’s protected, copied, carried, and sometimes stolen back.',
      'When the choice came between a brief mortal life and an endless vigil, he embraced the Baelnorn rite: lich-form, willingly taken, to preserve lore and safeguard the Realms’ memory. Not for conquest. Not for fear. For the archive.',
      'Now he narrates with the calm of someone who has waited centuries for a single lost citation to resurface — and who intends to keep the story intact, forever.',
    ],
  },
};

export const sponsors: Sponsor[] = [
  {
    id: 'dharma-web-solutions',
    name: 'Dharma Web Solutions',
    description:
      'A web studio focused on modern, performant sites and apps — built thoughtfully, accessibly, and with long-term maintainability in mind.',
    websiteUrl: 'https://dharmawebsolutions.com',
  },
];

export const episodes: Episode[] = [
  {
    id: '1ynlyPCiOPzbdXMv2SfaQE',
    title: 'An Introduction to The World of Faerûn',
    showName: 'The Lich’s Tale: A Faerûn Lorecast',
    publishedDateLabel: 'Mar 9, 2026',
    durationLabel: '1 hr 32 min',
    description:
      'Step into the hidden stacks beneath Waterdeep and listen as a friendly lich guides you through the long memory of Faerûn.',
    coverImageUrl: '/assets/lichtale-e-1-cover.png',
    coverImageAlt:
      'Episode 1 cover art for The Lich’s Tale: A Faerûn Lorecast',
    spotifyUrl:
      'https://open.spotify.com/episode/1ynlyPCiOPzbdXMv2SfaQE?si=5867a8651df34806',
    spotifyEmbedUrl:
      'https://open.spotify.com/embed/episode/1ynlyPCiOPzbdXMv2SfaQE?utm_source=generator&theme=0',
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'welcome-to-the-stacks',
    title: 'Welcome to the Stacks',
    excerpt:
      'Before the first episode drops, a quick note on what this show is — and what it refuses to be.',
    publishedDateLabel: 'Mar 8, 2026',
    tags: ['announcement', 'show-notes'],
    content: [
      {
        type: 'p',
        text: 'Faerûn is not a timeline — it’s a haunted archive. This podcast is a guided tour through the parts of the Realms that still hum with old magic: empires that fell, gods that vanished, and wars that left teeth in the soil.',
      },
      { type: 'h2', text: 'How we tell history' },
      {
        type: 'ul',
        items: [
          'Short arcs, focused eras, and a single thread per episode.',
          'Sources called out in show notes when possible.',
          'A little dramatization — but no lore made up wholesale.',
        ],
      },
      {
        type: 'p',
        text: 'If you like your lore like a forbidden tome — annotated, cross-referenced, and occasionally cursed — you’re home.',
      },
    ],
  },
  {
    slug: 'reading-list-candlekeep-starters',
    title: 'Candlekeep Starter Reading List',
    excerpt:
      'A curated stack of sources we love — from official references to long-running Realmslore communities.',
    publishedDateLabel: 'Mar 8, 2026',
    tags: ['resources', 'lore'],
    content: [
      {
        type: 'p',
        text: 'Not everyone wants homework. This is optional — but if you do enjoy reading alongside listening, here’s a short, reliable stack to prime your brain for deep time, myth, and Realms-shaping calamity.',
      },
      {
        type: 'ul',
        items: [
          'Pick an era you love and build outward from one event.',
          'Track names and places; Realms history likes to echo.',
          'Write down questions — we’ll turn them into episodes.',
        ],
      },
      { type: 'h2', text: 'Sources' },
      {
        type: 'p',
        text: 'These are the references and communities we reach for most often. Official sources help anchor names and terms; community spaces help track cross-edition echoes, citations, and deep-cut context.',
      },
      {
        type: 'ul',
        items: [
          'D&D Beyond (official): https://www.dndbeyond.com — A clean, searchable rules and reference hub. We love it for quick spell/item lookups and official terminology.',
          'Wizards of the Coast (D&D): https://dnd.wizards.com — The publisher’s home base for announcements, product info, and official updates.',
          'DMsGuild (Forgotten Realms titles & lore references): https://www.dmsguild.com — A marketplace of legacy PDFs and community work. We love it for finding out-of-print Realms material and citations.',
          'Forgotten Realms Wiki (community): https://forgottenrealms.fandom.com/wiki/Main_Page — A fast way to orient yourself when a name, place, or deity pops up mid-episode. Great for “what was that again?” moments.',
          'Candlekeep Forum (long-running Realmslore community): https://candlekeep.com/forum/ — One of the deepest Realmslore archives on the internet. We love it for scholarly threads, cross-references, and deep history.',
          'EN World (TTRPG community): https://www.enworld.org — A broad tabletop community with good discussion and news; great for context across editions and systems.',
          'Ed Greenwood (Forgotten Realms creator hub): https://www.edgreenwood.net — The creator’s hub with articles, lore, and Realms musings. We love it for flavor, intent, and the “why” behind the world.',
        ],
      },
    ],
  },
];

