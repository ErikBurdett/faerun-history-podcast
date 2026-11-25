import type { ReactNode } from 'react';

type Props = {
  art: 'erilian' | 'gilded-reach';
  alt: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
};

export default function FolioHero({ art, alt, label, title, children }: Props) {
  return <section className={`folio-hero hero-${art}`}>
    <picture>
      <source media="(max-width: 650px)" srcSet={`/assets/folio/${art}-small.webp`} />
      <img className="hero-art" src={`/assets/folio/${art}.webp`} alt={alt} fetchPriority="high" />
    </picture>
    <div className="hero-veil" />
    <div className="folio-width hero-inner">
      <p className="folio-label illuminated">{label}</p>
      <h1>{title}</h1>
      {children}
    </div>
  </section>;
}
