import { Link } from 'react-router-dom';
import { atlasRoot } from '../data/atlasShelves';
import TheandrilCardTable from '../components/TheandrilCardTable';
import { ArrowDown, ArrowUpRight, Expand } from 'lucide-react';
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

const portraits = [
  { slug: 'maude-of-grey-weir', name: 'Maude of Grey Weir', role: 'First Recorder', art: '/assets/atlas/cards/witness-roads.13.webp', line: 'A court asked her to change the date on a seal. Her apprentice remembered what she did with the ledgers.' },
  { slug: 'ilthen-vael', name: 'Ilthen Vael', role: 'The witness called Ledgerbone', art: '/assets/atlas/cards/ashfall.16.webp', line: 'He can still name the illness that took his brothers and the day he stopped needing to breathe.' },
  { slug: 'aldery-debt-crowned', name: 'Aldery, the Debt-Crowned', role: 'High Charter of the Anchorage', art: '/assets/atlas/cards/saltwind.16.webp', line: 'The stones accepted a pledge that bound families for three generations.' },
];

export default function Theandril() {
  return <div className="folio-page world-page">
    <FolioHero art="gilded-reach" alt="The Gilded Reach, with autumn oaks, a winding river, and distant towers." label="An original fantasy world" title="Theandril">
      <p className="hero-lede">We’re building Theandril in partnership with <a className="underline underline-offset-4" href="https://dharmawebsolutions.com">Dharma Web Solutions</a>. This original world is home to two games and a new podcast narrated by Erilian Kantonine.</p>
      <div className="folio-actions"><Link className="gilt-button" to={atlasRoot}>Enter the atlas <ArrowUpRight size={16}/></Link><a className="quiet-link" href="#games">Explore the games <ArrowDown size={15}/></a></div>
    </FolioHero>

    <nav className="folio-width world-contents" aria-label="Explore Theandril">
      <a href="#world">The hearthlands</a><a href="#paintings">The card table</a><a href="#characters">Characters</a><a href="#podcast">Podcast</a><a href="#games">Games</a>
    </nav>
    <section id="world" className="folio-width world-spread">
      <figure>
        <img src="/assets/folio/erilians-keep.webp" alt="Gold-leaved trees frame a hillside settlement rising towards Erilian’s keep." loading="lazy" width="1440" height="810"/>
        <figcaption>Erilian’s keep, seen from the valley</figcaption>
      </figure>
      <div className="guide-copy"><p className="folio-label">The hearthlands · Road Reckoning 2447</p><h2>After the Witness Roads</h2>
        <p>At Cold Ford, nineteen hearths once agreed to take any stranger’s lawful bargain at their stone. The toll was grain and remembrance. Within ten generations, four hundred stations could vouch for a promise made on the far side of the world.</p>
        <p>In 2311 the far stones fell silent. Two years later came the Ashfall. People still disagree about its cause. At Loamferry today, a pilot accepts coin, grain or a day’s work from either bank. The bargain holds as far as the pilot can carry you.</p>
        <div className="mini-links world-book"><Link to={atlasRoot+'/fieldbook/reading-a-waystation'}>Visit a waystation <ArrowUpRight size={14}/></Link><Link to={atlasRoot+'/fieldbook/the-gilded-reach'}>Walk the Gilded Reach <ArrowUpRight size={14}/></Link><Link to={atlasRoot+'/chronicle/the-book-of-broken-roads'}>Read Ilthen’s chronicle <ArrowUpRight size={14}/></Link></div>
      </div>
    </section>
    <TheandrilCardTable/>
    <section className="folio-width front-shelf world-portraits" id="characters" aria-labelledby="names-title">
      <div className="section-title"><div><p className="folio-label">From the Book of Broken Roads</p><h2 id="names-title">Names in the margins</h2></div>
        <Link className="quiet-link" to={atlasRoot+'/characters'}>Meet the characters <ArrowUpRight size={16}/></Link>
      </div>
      <div className="portrait-row">{portraits.map(person => <Link key={person.slug} to={atlasRoot+'/characters/'+person.slug}>
        <img src={person.art} alt="" loading="lazy" width="256" height="384"/>
        <div><p className="folio-label">{person.role}</p><h3>{person.name}</h3><p>{person.line}</p></div>
      </Link>)}</div>
    </section>

    <section id="podcast" className="folio-width world-invitation mb-12" aria-labelledby="podcast-heading">
      <img src="/assets/folio/erilian.webp" alt="Erilian Kantonine reading by candlelight in his archive." loading="lazy" />
      <div>
        <h2 id="podcast-heading">Erilian’s new podcast</h2>
        <p>Listeners of <cite>The Lich’s Tale</cite> know Erilian as the keeper of Faerûn’s histories. In this new podcast, he turns to Theandril. It’s the same world where you can sit down for a game of cards on the Sallow or lead a caravan out to found a town. This time, you can come as a listener.</p>
        <Link className="quiet-link" to={atlasRoot+'/characters/erilian-kantonine'}>Meet Erilian at the tavern <ArrowUpRight size={15}/></Link>
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

  </div>;
}
