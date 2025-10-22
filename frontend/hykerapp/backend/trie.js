class Node {
    constructor(ch, isWord){
        this.ch = ch;
        this.isWord = isWord;
        this.children = {};
    }
}

class Trie{
    constructor(){
        this.insertDataMember = 0;
        this.root = Node("root");
        this.wordlist = [];
    }

    insert(word) {
        if (!/^[a-zA-Z]+$/.test(word)) {
            return false; // only allow alphabetic words
        }

        let currNode = this.root;
        let inTrie = 0;

        for (const ch of word.toLowerCase()) {
            if (!currNode.children[ch]) {
               currNode.children[ch] = new Node(ch);
            } else {
               inTrie += 1;
            }
            currNode = currNode.children[ch];
        }

        if (inTrie === word.length) {
            return false;
        }

        this.insertDataMember += 1;
        currNode.isWord = true;
        return true;
    }

    search(word) {
        let currNode = this.root;

        for (const ch of word.toLowerCase()) {
            if (!currNode.children[ch]) {
            return false;
            } else {
            currNode = currNode.children[ch];
            }
        }

        return currNode.isWord === true;
    }
}