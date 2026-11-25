import type { ReactNode } from 'react';

export default function ArchiveHeading({ title, art = 'study', children }: {
  title: string;
  art?: 'study' | 'cartography' | 'erilian-small';
  children: ReactNode;
}) {
  return <header className="archive-heading">
    <img src={`/assets/folio/${art}.webp`} alt="" />
    <div><h1>{title}</h1><p>{children}</p></div>
  </header>;
}
