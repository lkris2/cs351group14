class CategoryNode:
    def __init__(self, category_path):
        self.path = category_path
        self.parent = None
        self.children = {}
        self.items = set()  # Store items in this category


class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.frequency = 0
        self.stored_word = None  # Store original case of word
        self.metadata = {}  # Store additional information
        self.categories = {}  # Map of category path to CategoryNode
        self.aliases = set()  # Alternative names
        self.prefix_group = None  # Group for prefix-based categorization


class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.word_count = 0
        self.total_searches = 0

    def bulk_insert(self, words):
        """Insert multiple words into the trie at once"""
        for word in words:
            self.insert(word)
        return self.word_count

    def insert(self, word, category_path=None, metadata=None, aliases=None):
        """Insert a word into the trie with category hierarchy support"""
        if not word:
            return

        node = self.root
        stored_word = word  # Keep original word for output
        word = word.lower()  # Use lowercase for searching
        self.word_count += 1

        # Add prefix grouping
        prefix_length = 3
        prefix_group = word[:prefix_length] if len(word) >= prefix_length else word

        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]

        node.is_end = True
        node.frequency += 1
        node.stored_word = stored_word
        node.prefix_group = prefix_group

        # Handle metadata
        if metadata:
            node.metadata.update(metadata)

        # Handle category path
        if category_path:
            if category_path not in node.categories:
                category_node = CategoryNode(category_path)
                node.categories[category_path] = category_node
            category_node = node.categories[category_path]
            category_node.items.add(stored_word)

        # Handle aliases
        if aliases:
            node.aliases.update(set(aliases))
            # Also insert aliases as searchable terms
            for alias in aliases:
                self.insert(alias, category_path=category_path)

    def search(self, prefix, category_path=None, limit=10, include_metadata=False):
        """Search with support for hierarchical categories"""
        if not prefix and not category_path:
            return []

        results = []
        node = self.root
        if prefix:
            prefix = prefix.lower()
            # Navigate to prefix node
            for char in prefix:
                if char not in node.children:
                    return []
                node = node.children[char]

        # Collect results with category filtering
        self._dfs(node, prefix or "", results, limit, category_path, include_metadata)

        # Sort results by frequency (descending) and then alphabetically
        return sorted(results, key=lambda x: (-x["frequency"], x["word"]))[:limit]

    def _dfs(self, node, prefix, results, limit, category_path=None, include_metadata=False):
        """Depth-first search with category hierarchy support"""
        if len(results) >= limit:
            return

        if node.is_end:
            # Check category hierarchy
            matches = True
            if category_path:
                matches = False
                for cat_path in node.categories:
                    if cat_path == category_path or cat_path.startswith(f"{category_path}/"):
                        matches = True
                        break

            if matches:
                result = {
                    "word": node.stored_word,
                    "frequency": node.frequency,
                    "score": self._calculate_score(node),
                    "categories": list(node.categories.keys()),
                }

                if include_metadata:
                    result.update(
                        {"metadata": node.metadata, "aliases": list(node.aliases)}
                    )

                results.append(result)

        # Visit children in alphabetical order
        for char in sorted(node.children.keys()):
            self._dfs(node.children[char], prefix + char, results, limit, category_path, include_metadata)

    def _calculate_score(self, node):
        """Calculate relevance score based on frequency and other factors"""
        score = node.frequency * 10  # Base score from frequency
        if len(node.stored_word) < 15:  # Bonus for shorter words
            score += 5
        return score

    def get_statistics(self):
        """Get statistics about the trie"""
        return {
            "total_words": self.word_count,
            "total_searches": self.total_searches,
            "most_frequent": self._get_most_frequent(5),
        }

    def _get_most_frequent(self, limit=5):
        """Get the most frequently searched words"""
        results = []
        self._collect_all_words(self.root, "", results)
        return sorted(results, key=lambda x: x["frequency"], reverse=True)[:limit]

    def _collect_all_words(self, node, current_word, results):
        """Helper method to collect all words in the trie"""
        if node.is_end:
            results.append({"word": node.stored_word, "frequency": node.frequency})
        for char, child in node.children.items():
            self._collect_all_words(child, current_word + char, results)

    def autocomplete_with_typos(self, prefix, max_distance=1, limit=10):
        """Search with fuzzy matching for typo tolerance"""
        if not prefix:
            return []

        results = []
        self._fuzzy_search(self.root, prefix.lower(), "", max_distance, results)

        # Sort by edit distance first, then frequency
        return sorted(results, key=lambda x: (x["distance"], -x["frequency"]))[:limit]

    def _fuzzy_search(self, node, target, current, max_distance, results):
        """Helper method for fuzzy search using edit distance"""
        if node.is_end:
            distance = self._levenshtein_distance(target, current)
            if distance <= max_distance:
                results.append(
                    {"word": node.stored_word, "frequency": node.frequency, "distance": distance}
                )

        for char, child in node.children.items():
            self._fuzzy_search(child, target, current + char, max_distance, results)

    def _levenshtein_distance(self, s1, s2):
        """Calculate the edit distance between two strings"""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        if not s2:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row

        return previous_row[-1]

    def get_prefix_group_suggestions(self, prefix, limit=5):
        """Get suggestions from the same prefix group"""
        if len(prefix) < 3:
            return []

        prefix_group = prefix[:3].lower()
        results = []

        def collect_group(node, current_word):
            if len(results) >= limit:
                return
            if node.is_end and node.prefix_group == prefix_group:
                results.append({"word": node.stored_word, "score": self._calculate_score(node)})
            for char, child in node.children.items():
                collect_group(child, current_word + char)

        collect_group(self.root, "")
        return sorted(results, key=lambda x: x["score"], reverse=True)

    def search_by_category(self, category, limit=10):
        """Search for words in a specific category"""
        results = []

        def collect_category(node, current_word):
            if len(results) >= limit:
                return
            if node.is_end and category in node.categories:
                results.append(
                    {
                        "word": node.stored_word,
                        "score": self._calculate_score(node),
                        "metadata": node.metadata,
                    }
                )
            for char, child in node.children.items():
                collect_category(child, current_word + char)

        collect_category(self.root, "")
        return sorted(results, key=lambda x: x["score"], reverse=True)

    def add_alias(self, word, alias):
        """Add an alternative name for a word"""
        node = self._find_word_node(word.lower())
        if node and node.is_end:
            node.aliases.add(alias)
            self.insert(alias)  # Also insert alias as a searchable term
            return True
        return False

    def _find_word_node(self, word):
        """Find the node corresponding to a word"""
        node = self.root
        for char in word.lower():
            if char not in node.children:
                return None
            node = node.children[char]
        return node if node.is_end else None
