import {Node, Trie}from "./trie"
const trie = new Trie();
const locations = [
  "UIC Main Campus",
  "Student Center East",
  "Student Center West",
  "University Village / Little Italy",
  "Pilsen",
  "Greektown",
  "Union Station",
  "Willis Tower (Sears Tower)",
  "Millennium Park",
  "Maggie Daley Park",
  "Navy Pier",
  "The Loop (Downtown Chicago)",
  "Museum Campus (Field Museum / Shedd / Adler)",
  "Grant Park",
  "McCormick Place",
  "Chinatown",
  "West Loop / Restaurant Row",
  "United Center",
  "Lincoln Park Zoo",
  "Wrigley Field"
];

for (const place of locations) {
  trie.insert(place);
}

export default trie;


