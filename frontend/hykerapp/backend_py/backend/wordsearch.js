import {Node, Trie}from "./trie"
const trie = new Trie();
const locations = [
  "Dr. Martin Luther King Jr. Drive",
    "Madison Street",
    "Randolph Street",
    "Pershing Road",
    "Garfield Boulevard",
    "95th Street",
    "Lake Street",
    "Hubbard Street",
    "Grand Avenue",
    "Ohio Street",
    "Chicago Avenue",
    "Oak Street",
    "Division Street"
];

for (const place of locations) {
  trie.insert(place);
}

export default trie;


