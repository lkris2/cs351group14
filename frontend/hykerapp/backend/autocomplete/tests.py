from django.test import TestCase
from .trie import Trie, TrieNode

class TrieTests(TestCase):
    def setUp(self):
        self.trie = Trie()
        
    def test_insert_and_search_single_word(self):
        """Test inserting and searching a single word"""
        self.trie.insert("Chicago")
        results = self.trie.search("Chi")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['word'], "Chicago")  # Preserves original case
        self.assertEqual(results[0]['frequency'], 1)

    def test_multiple_words_same_prefix(self):
        """Test multiple words with same prefix"""
        test_locations = ["Chicago", "China", "Chile"]
        for loc in test_locations:
            self.trie.insert(loc)
        
        results = self.trie.search("Chi")
        self.assertEqual(len(results), 3)  # Should find Chicago, China, and Chile
        words = [result['word'] for result in results]
        self.assertIn("Chicago", words)
        self.assertIn("China", words)
        self.assertIn("Chile", words)

    def test_frequency_count(self):
        """Test that frequency increases with multiple inserts"""
        self.trie.insert("Chicago")
        self.trie.insert("Chicago")
        self.trie.insert("China")
        
        results = self.trie.search("Chi")
        chicago_result = next(r for r in results if r['word'] == "Chicago")
        self.assertEqual(chicago_result['frequency'], 2)

    def test_case_insensitive(self):
        """Test case-insensitive search"""
        self.trie.insert("Chicago")
        results_lower = self.trie.search("chi")
        results_upper = self.trie.search("CHI")
        self.assertEqual(results_lower, results_upper)

    def test_empty_prefix(self):
        """Test search with empty prefix"""
        self.trie.insert("Chicago")
        results = self.trie.search("")
        self.assertEqual(len(results), 0)

    def test_no_matches(self):
        """Test search with no matches"""
        self.trie.insert("Chicago")
        results = self.trie.search("New")
        self.assertEqual(len(results), 0)

    def test_limit_results(self):
        """Test limiting number of results"""
        locations = ["Chicago", "China", "Chile", "Chihuahua", "Chinatown"]
        for loc in locations:
            self.trie.insert(loc)
        
        results = self.trie.search("Chi", limit=3)
        self.assertEqual(len(results), 3)  # Should only return 3 results
        
    def test_bulk_insert(self):
        """Test bulk insert functionality"""
        locations = ["Chicago", "New York", "Los Angeles", "Houston", "Phoenix"]
        count = self.trie.bulk_insert(locations)
        self.assertEqual(count, 5)
        
        results = self.trie.search("Ch")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['word'], "Chicago")
        
    def test_fuzzy_search(self):
        """Test fuzzy search with typos"""
        self.trie.insert("Chicago")
        
        # Test with one typo
        results = self.trie.autocomplete_with_typos("Chicgo")  # Missing 'a'
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['word'], "Chicago")
        self.assertEqual(results[0]['distance'], 1)
        
        # Test with two typos (should not match with default max_distance=1)
        results = self.trie.autocomplete_with_typos("Chikagu")
        self.assertEqual(len(results), 0)
        
    def test_statistics(self):
        """Test trie statistics"""
        locations = ["Chicago", "New York", "Chicago", "Los Angeles", "Chicago"]
        for loc in locations:
            self.trie.insert(loc)
            
        stats = self.trie.get_statistics()
        self.assertTrue('total_words' in stats)
        self.assertTrue('most_frequent' in stats)
        
        most_frequent = stats['most_frequent']
        self.assertEqual(most_frequent[0]['word'], "Chicago")
        self.assertEqual(most_frequent[0]['frequency'], 3)
        
    def test_scoring(self):
        """Test relevance scoring"""
        self.trie.insert("Chicago")
        self.trie.insert("Chicago")  # Increase frequency
        self.trie.insert("Chinatown")
        
        results = self.trie.search("Chi")
        self.assertEqual(len(results), 2)
        
        # Chicago should have higher score due to higher frequency
        self.assertTrue(results[0]['score'] > results[1]['score'])
        
    def test_categories(self):
        """Test category-based search"""
        self.trie.insert("Chicago", category_path="city")
        self.trie.insert("China", category_path="country")
        self.trie.insert("Chinatown", category_path="city")
        
        # Search in city category
        city_results = self.trie.search("Chi", category_path="city")
        self.assertEqual(len(city_results), 2)
        self.assertIn("Chicago", [r['word'] for r in city_results])
        self.assertIn("Chinatown", [r['word'] for r in city_results])
        
        # Search in country category
        country_results = self.trie.search("Chi", category_path="country")
        self.assertEqual(len(country_results), 1)
        self.assertEqual(country_results[0]['word'], "China")
        
    def test_prefix_groups(self):
        """Test prefix group suggestions"""
        self.trie.insert("Chicago")
        self.trie.insert("Chile")
        self.trie.insert("China")
        self.trie.insert("Paris")  # Different prefix group
        
        suggestions = self.trie.get_prefix_group_suggestions("Chi")
        self.assertEqual(len(suggestions), 3)
        words = {result['word'] for result in suggestions}
        self.assertEqual(words, {"Chicago", "Chile", "China"})
        
    def test_aliases(self):
        """Test alias functionality"""
        self.trie.insert("Chicago")
        self.assertTrue(self.trie.add_alias("Chicago", "Windy City"))
        
        # Search should find both original and alias
        results = self.trie.search("Chi")
        self.assertIn("Chicago", [r['word'] for r in results])
        
        results = self.trie.search("Win")
        self.assertIn("Windy City", [r['word'] for r in results])
        
    def test_metadata(self):
        """Test metadata storage and retrieval"""
        metadata = {
            "population": 2700000,
            "state": "Illinois"
        }
        self.trie.insert("Chicago", metadata=metadata)
        
        results = self.trie.search("Chi", include_metadata=True)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['metadata'], metadata)
        
    def test_hierarchical_categories(self):
        """Test hierarchical category support"""
        # Setup category hierarchy
        categories = {
            "us/illinois/city": ["Chicago", "Springfield"],
            "us/new-york/city": ["New York", "Buffalo"],
            "us/illinois/town": ["Urbana", "Champaign"],
        }
        
        # Insert words with their categories
        for cat_path, words in categories.items():
            for word in words:
                self.trie.insert(word, category_path=cat_path)
        
        # Test searching within a state
        il_results = self.trie.search("", category_path="us/illinois")
        self.assertEqual(len(il_results), 4)  # All Illinois locations
        
        # Test searching within a specific category type
        city_results = self.trie.search("", category_path="us/illinois/city")
        self.assertEqual(len(city_results), 2)  # Only Illinois cities
        

        
    def test_category_inheritance(self):
        """Test that subcategories inherit from parent categories"""
        # Setup hierarchical categories
        self.trie.insert("Chicago", category_path="us/illinois/city")
        self.trie.insert("Springfield", category_path="us/illinois/city")
        
        # Search at different levels of the hierarchy
        us_results = self.trie.search("", category_path="us")
        il_results = self.trie.search("", category_path="us/illinois")
        city_results = self.trie.search("", category_path="us/illinois/city")
        
        # All searches should find both cities
        self.assertEqual(len(us_results), 2)
        self.assertEqual(len(il_results), 2)
        self.assertEqual(len(city_results), 2)
