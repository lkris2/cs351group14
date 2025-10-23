from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Location
from .serializers import LocationSerializer
from .trie import Trie

class LocationAutocompleteViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    trie_instance = None

    def get_trie(self):
        """Get or create Trie instance with cached locations"""
        if not self.trie_instance:
            # Try to get from cache first
            self.trie_instance = cache.get('location_trie')
            if not self.trie_instance:
                # If not in cache, create new and populate
                self.trie_instance = Trie()
                locations = Location.objects.all()
                for loc in locations:
                    self.trie_instance.insert(loc.name)
                # Cache for future use
                cache.set('location_trie', self.trie_instance)
        return self.trie_instance

    @action(detail=False, methods=['get'])
    def suggest(self, request):
        """Return location suggestions based on prefix"""
        prefix = request.query_params.get('q', '').strip()
        if not prefix:
            return Response([])

        trie = self.get_trie()
        suggestions = trie.search(prefix)
        return Response(suggestions)

    def create(self, request, *args, **kwargs):
        """Create or update a location and update Trie"""
        # Handle bulk insert
        if isinstance(request.data, list):
            return self._bulk_create(request.data)
            
        location_name = request.data.get('name', '').strip()
        if not location_name:
            return Response(
                {'error': 'Location name is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create or update location in database
        location, created = Location.objects.get_or_create(
            name=location_name
        )
        if not created:
            location.frequency += 1
            location.save()

        # Update Trie
        trie = self.get_trie()
        trie.insert(location_name)
        cache.set('location_trie', trie)  # Update cache

        serializer = self.get_serializer(location)
        return Response(serializer.data, 
                      status=status.HTTP_201_CREATED if created 
                      else status.HTTP_200_OK)
    
    def _bulk_create(self, locations):
        """Handle bulk creation of locations"""
        created_count = 0
        trie = self.get_trie()
        
        for loc_data in locations:
            name = loc_data.get('name', '').strip()
            if name:
                location, created = Location.objects.get_or_create(name=name)
                if created:
                    created_count += 1
                trie.insert(name)
                
        cache.set('location_trie', trie)
        return Response({
            'message': f'Successfully processed {len(locations)} locations',
            'created': created_count
        }, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=['get'])
    def fuzzy_search(self, request):
        """Endpoint for fuzzy search with typo tolerance"""
        query = request.query_params.get('q', '').strip()
        max_distance = int(request.query_params.get('max_distance', 1))
        limit = int(request.query_params.get('limit', 10))
        
        trie = self.get_trie()
        results = trie.autocomplete_with_typos(
            query,
            max_distance=max_distance,
            limit=limit
        )
        return Response(results)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get statistics about the autocomplete system"""
        trie = self.get_trie()
        stats = trie.get_statistics()
        return Response(stats)
