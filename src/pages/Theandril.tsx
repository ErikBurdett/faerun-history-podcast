import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import FolioHero from '../components/FolioHero';

const games = [
  {
    title: 'Hearth & Card', genre: 'Card duels & tavern keeping', art: 'tavern', gameplay: 'grimoire', gameplayCaption: 'Erilian’s grimoire, open to the card collection.', caption: 'Concept painting · A tavern interior',
    description: 'Downstream of Grey Weir, Erilian trades his lectern for a tavern counter. Stock the shelves, brew for your guests, and take a seat across from a rival. The cards in your deck carry fragments of the very history the tavern stands on.',
    url: 'https://erikburdett.github.io/theandril-hearth-and-card/', action: 'Play Hearth & Card',
  },
  {
    title: 'Theandril', genre: 'Turn-based 4X strategy', art: 'wardhall', gameplay: 'campaign', gameplayCaption: 'A hearth caravan on the campaign map, with the coast still to explore.', caption: 'Concept painting · Wardhall river town',
    description: 'Lead a hearth caravan into unmapped country and choose where to settle. Put fields to work, connect your towns by road, and decide which neighbors to bargain with. At the end of the campaign, its chronicle records the history you made.',
    url: 'https://erikburdett.github.io/Theandril/', action: 'Play the 4X demo',
  },
];

const cards = [
  { art: 'grey-weir-apprentice', name: 'Grey Weir Apprentice', type: 'Creature', alt: 'An apprentice raises a glowing hand as a dark bird circles above.' },
  { art: 'honest-seal', name: 'The Honest Seal', type: 'Creature', alt: 'A seal rests against a carved stone amid lanterns and broken masonry.' },
  { art: 'dawnfield', name: 'Grey Weir Dawnfield', type: 'Basic Resource', alt: 'Stone rings span a paved road through the ruined city.' },
  { art: 'hold-the-lantern', name: 'Grey Weir: Hold the Lantern', type: 'Instant', alt: 'Two travelers shelter behind a circle of light on a dark road.' },
];

function CardGallery() {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const active = cards[index];
  function step(direction: number) {
    setIndex(current => (current + direction + cards.length) % cards.length);
  }
  return <section className="folio-width front-shelf" id="paintings">
    <div className="section-title"><div><p className="folio-label">Hearth &amp; Card · The Witness Roads</p><h2>At the card table</h2></div></div>
    <p className="section-intro">A few leaves from the Grey Weir collection. Select a painting to see its full illustration.</p>
    <div className="card-shelf">{cards.map((card, i) => <button key={card.art} type="button" className="painted-card" onClick={() => { setIndex(i); dialog.current?.showModal(); }}>
      <span className="card-picture"><img loading="lazy" src={`/assets/folio/${card.art}.webp`} alt={card.alt}/><Expand size={16}/></span>
      <span className="folio-label">{card.type}</span><span className="card-name">{card.name}</span>
    </button>)}</div>
    <dialog ref={dialog} className="art-viewer" aria-labelledby="painting-title" onKeyDown={e => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    }}>
      <button autoFocus className="close-art" onClick={() => dialog.current?.close()} aria-label="Close painting"><X size={20}/></button>
      <img src={`/assets/folio/${active.art}.webp`} alt={active.alt} loading="lazy" />
      <div className="viewer-controls"><button onClick={() => step(-1)} aria-label="Previous painting"><ChevronLeft/></button><div aria-live="polite"><p className="folio-label">{active.type}</p><h3 id="painting-title">{active.name}</h3></div><button onClick={() => step(1)} aria-label="Next painting"><ChevronRight/></button></div>
    </dialog>
  </section>;
}

export default function Theandril() {
  return <div className="folio-page world-page">
    <FolioHero art="gilded-reach" alt="The Gilded Reach, with autumn oaks, a winding river, and distant towers." label="An original fantasy world" title="Theandril">
      <p className="hero-lede">We’re building Theandril in partnership with <a className="underline underline-offset-4" href="https://dharmawebsolutions.com">Dharma Web Solutions</a>. This original world is home to two games and a new podcast narrated by Erilian Kantonine.</p>
      <div className="folio-actions"><a className="gilt-button" href="#games">Explore the games <ArrowDown size={16}/></a><a className="quiet-link" href="#world">Read the world guide <ArrowDown size={15}/></a></div>
    </FolioHero>

    <section id="world" className="folio-width world-guide">
      <div><p className="folio-label">The world guide</p><h2>After the <br/><em>Witness Roads</em></h2></div>
      <div className="guide-copy"><p>In year 2311 of the Road Reckoning, the Witness Roads failed. Bargains once trusted across a continent had to be made again, face to face. Two years later came the Ashfall. Its cause is still disputed.</p>
        <p>By 2447, a map of a pass or the name of a family willing to shelter a stranger can decide whether a journey succeeds. The Ashen Compact’s craft households make their oaths in public. Downriver, the Reedbound Council settles disputes between boat families and the people who drain the banks. On the coast, the charter towns of Glass Tide must agree who will pay to open a dangerous route.</p>
        <p>Both games begin in this world. One gives you a table at the river’s edge. The other puts the next settlement in your hands.</p>
        <a className="quiet-link world-book" href="https://github.com/ErikBurdett/Theandril/blob/master/docs/lore/The%20Book%20of%20Broken%20Roads/The%20Book%20of%20Broken%20Roads.md">Read The Book of Broken Roads <ArrowUpRight size={16}/></a>
      </div>
    </section>

    <section id="podcast" className="folio-width world-invitation mb-12" aria-labelledby="podcast-heading">
      <img src="/assets/folio/erilian.webp" alt="Erilian Kantonine reading by candlelight in his archive." loading="lazy" />
      <div>
        <h2 id="podcast-heading">Erilian’s new podcast</h2>
        <p>Listeners of <cite>The Lich’s Tale</cite> know Erilian as the keeper of Faerûn’s histories. In this new podcast, he turns to Theandril. It’s the same world where you can sit down for a game of cards on the Sallow or lead a caravan out to found a town. This time, you can come as a listener.</p>
      </div>
    </section>

    <section id="games" className="folio-width games-section">
      <div className="section-title"><div><p className="folio-label">Playable in your browser</p><h2>The games</h2></div></div>
      <div className="game-grid">{games.map(game => <article key={game.title}>
        <figure><img src={`/assets/folio/${game.art}.webp`} alt={game.caption} loading="lazy"/><figcaption>{game.caption}</figcaption></figure>
        <div className="game-details"><p className="folio-label">{game.genre}</p><h3>{game.title}</h3><p>{game.description}</p>
          <div className="folio-actions"><a href={game.url} className="gilt-button">{game.action}<ArrowUpRight size={16}/></a><a href={game.url + 'updates/'} className="quiet-link">Developer journal <ArrowUpRight size={14}/></a></div>
          <details className="gameplay-view"><summary>View gameplay <Expand size={14}/></summary>
            <figure><img loading="lazy" src={`/assets/folio/${game.gameplay}.webp`} alt={game.gameplayCaption}/><figcaption>{game.gameplayCaption}</figcaption></figure>
          </details>
        </div>
      </article>)}</div>
    </section>
    <CardGallery/>
  </div>;
}
