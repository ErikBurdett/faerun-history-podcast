import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const directory = new URL("../src/data/atlas/", import.meta.url);
const publicRoot = new URL("../public/", import.meta.url);
const read = (file) =>
  JSON.parse(readFileSync(new URL(file, directory), "utf8"));
const entries = read("index.json");
const keys = new Set(entries.map((entry) => entry.key));
assert.equal(keys.size, entries.length, "Repeated atlas address");
const volumes = new Map(
  readdirSync(directory)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .map((file) => [file.slice(0, -5), read(file)]),
);
const records = [...volumes.values()].flatMap(Object.keys);
assert.equal(records.length, keys.size, "Reader and inventory counts differ");
for (const entry of entries) {
  const volume = entry.parent.split("/")[1] || entry.key.split("/")[0];
  const text = volumes.get(volume)?.[entry.key];
  assert.ok(text, "Missing reader text for " + entry.key);
  if (entry.art) {
    assert.ok(
      entry.art.startsWith("/assets/") &&
        existsSync(new URL("." + entry.art, publicRoot)),
      "Missing art for " + entry.key,
    );
  }
  const destinations = [
    ...text.related,
    ...[...text.body.matchAll(/\]\(\/theandril\/atlas\/([^)]+)\)/g)].map(
      (match) => match[1],
    ),
  ];
  if (entry.parent) destinations.push(entry.parent);
  for (const target of destinations)
    assert.ok(keys.has(target), entry.key + " links to missing " + target);
}
const byKey = new Map(entries.map(entry => [entry.key, entry]));
for (const hand of read("../theandrilTable.json")) {
  for (const card of hand.cards) {
    const entry = byKey.get(card.key);
    assert.ok(entry?.parent, "Unknown card on the Theandril page: " + card.key);
    assert.deepEqual(
      [card.name, card.art, card.line, card.volume],
      [entry.title, entry.art, entry.summary, byKey.get(entry.parent).title],
      "Theandril card table differs from the grimoire: " + card.key,
    );
  }
}
console.log(
  "Verified " +
    entries.length +
    " atlas entries, their illustrations and reading links.",
);
