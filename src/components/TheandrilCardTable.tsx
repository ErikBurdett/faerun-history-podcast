import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { atlasRoot } from '../data/atlasShelves';
import table from '../data/theandrilTable.json';

export default function TheandrilCardTable() {
  const [hand, setHand] = useState(0);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const cards = table[hand].cards;
  const active = cards[index];
  function step(direction: number) {
    setIndex(current => (current + direction + cards.length) % cards.length);
  }
  return <section className="folio-width front-shelf world-card-table" id="paintings" aria-labelledby="card-table-title">
    <div className="section-title"><div><p className="folio-label">Hearth &amp; Card</p><h2 id="card-table-title">At Erilian’s card table</h2></div>
      <Link className="quiet-link" to={atlasRoot+'/grimoire'}>Open the grimoire <ArrowUpRight size={16}/></Link>
    </div>
    <p className="section-intro">Maude kept the books at Grey Weir. Aldery bound three generations to pay for a trade war. Erilian deals their portraits across the same wooden table.</p>
    <div className="table-hands" role="group" aria-label="Choose a hand of paintings">{table.map((group, i) =>
      <button key={group.title} type="button" aria-pressed={hand === i} onClick={() => { setIndex(0); setHand(i); }}>{group.title}</button>
    )}</div>
    <div className="card-shelf">{cards.map((card, i) => <button key={card.key} type="button" className="painted-card" aria-label={'View '+card.name} onClick={() => { setIndex(i); dialog.current?.showModal(); }}>
      <span className="card-picture"><img loading="lazy" width="256" height="384" src={card.art} alt=""/><Expand size={16} aria-hidden="true"/></span>
      <span className="folio-label">{card.volume}</span><span className="card-name">{card.name}</span>
    </button>)}</div>
    <dialog ref={dialog} className="art-viewer world-art-viewer" aria-labelledby="painting-title" onKeyDown={e => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    }}>
      <button autoFocus className="close-art" onClick={() => dialog.current?.close()} aria-label="Close painting"><X size={20}/></button>
      <img src={active.art} alt={active.name} loading="lazy" width="256" height="384"/>
      <div className="viewer-controls"><button onClick={() => step(-1)} aria-label="Previous painting"><ChevronLeft/></button><div aria-live="polite"><p className="folio-label">{active.volume}</p><h3 id="painting-title">{active.name}</h3></div><button onClick={() => step(1)} aria-label="Next painting"><ChevronRight/></button></div>
      <p className="viewer-line">{active.line}</p>
      <Link className="quiet-link" to={atlasRoot+'/'+active.key}>Read this card <ArrowUpRight size={14}/></Link>
    </dialog>
  </section>;
}
