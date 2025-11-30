from django.contrib import admin

# MongoEngine documents cannot be registered with Django admin
# All models are now stored in MongoDB and accessed via API endpoints
# admin.site.register() is not needed for MongoEngine documents