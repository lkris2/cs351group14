export class Node {
    constructor(ch, isWord){
        this.ch = ch;
        this.isWord = isWord;
        this.children = {};
    }
}

export class Trie{
    constructor(){
        this.insertDataMember = 0;
        this.root = new Node("root");
        this.wordlist = [];
    }

    insert(word) {
        // if (!/^[a-zA-Z]+$/.test(word)) {
        //     return false; // only allow alphabetic words
        // }

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

    getSuggestions(prefix){
        let curr = this.root;
        const results = [];

        for (const ch of prefix.toLowerCase()) {
            if (!curr.children[ch]) return results;
            curr = curr.children[ch];
        }

        const dfs = (node, path) => {
            if (node.isWord) results.push(path);
            for (const [ch, nextNode] of Object.entries(node.children)) {
            dfs(nextNode, path + ch);
            }
        };

        dfs(curr, prefix.toLowerCase());
        return results;
    }
}