export const atlasRoot = "/theandril/atlas";

export const shelves = [
  {
    id: "chronicle",
    title: "The Book of Broken Roads",
    art: "/assets/folio/study.webp",
    line: "At Grey Weir, a recorder takes an oath to write down what he can attest. Open Ilthen Vael’s book at the beginning.",
  },
  {
    id: "places",
    title: "Along the roads",
    art: "/assets/folio/wardhall.webp",
    line: "Come ashore at a city that sells wrecks, cross at Loamferry, or follow a drowned causeway to the sea.",
  },
  {
    id: "peoples",
    title: "Peoples of the hearthlands",
    art: "/assets/atlas/cards/rekindled.1.webp",
    line: "Read the word on a banner. Learn whose work feeds a town, who speaks for it, and what its neighbors remember.",
  },
  {
    id: "grimoire",
    title: "Erilian’s grimoire",
    art: "/assets/atlas/cards/witness-roads.16.webp",
    line: "Turn the painted leaves of nine historical volumes and four contemporary folios. The keeper has written in the margins.",
  },
  {
    id: "tavern",
    title: "The tavern on the Sallow",
    art: "/assets/folio/tavern.webp",
    line: "Meet the smith, the ferryman, and the winter scribe. A guest will often tell you more across the card table.",
  },
  {
    id: "fieldbook",
    title: "A traveler’s fieldbook",
    art: "/assets/folio/cartography.webp",
    line: "Recognize ashglass on the strand, learn a Waykeeper’s calling, and find out what goes into a hearth’s winter stores.",
  },
  {
    id: "council",
    title: "At the council fire",
    art: "/assets/atlas/cards/first-oaths.16.webp",
    line: "A harvest too large for the granary. A stranger at the gate. Hear the petition and weigh the answers a hearth might give.",
  },
];

export type AtlasEntry = {
  key: string;
  title: string;
  tag: string;
  summary: string;
  art: string;
  parent: string;
  terms?: string;
};
export type AtlasFigure = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};
export type AtlasText = {
  figures?: AtlasFigure[];
  body: string;
  related: string[];
  choices: { label: string; description: string }[];
};
