from django.db import models
from django.contrib.postgres.fields import JSONField

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subcategories')
    level = models.IntegerField(default=0)  # Depth in hierarchy
    path = models.CharField(max_length=255, unique=True)  # Full path in hierarchy
    
    def save(self, *args, **kwargs):
        # Calculate level and path
        if self.parent:
            self.level = self.parent.level + 1
            self.path = f"{self.parent.path}/{self.slug}"
        else:
            self.level = 0
            self.path = self.slug
        super().save(*args, **kwargs)
    
    def get_ancestors(self):
        """Get all parent categories up to root"""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return list(reversed(ancestors))
    
    def get_descendants(self):
        """Get all subcategories recursively"""
        descendants = []
        for child in self.subcategories.all():
            descendants.append(child)
            descendants.extend(child.get_descendants())
        return descendants
    
    def get_siblings(self):
        """Get categories at the same level with the same parent"""
        if self.parent:
            return self.parent.subcategories.exclude(id=self.id)
        return Category.objects.filter(parent=None).exclude(id=self.id)
    
    def __str__(self):
        return self.path
    
    class Meta:
        verbose_name_plural = "categories"
        ordering = ['path']

class Location(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='locations')
    frequency = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional metadata fields
    address = models.CharField(max_length=500, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)  # For flexible additional data
    aliases = models.JSONField(default=list, blank=True)  # Alternative names
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['name', 'category']  # Allow same name in different categories
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category', 'name']),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"
