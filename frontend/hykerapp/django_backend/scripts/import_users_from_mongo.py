#!/usr/bin/env python
"""
Import users from a MongoDB collection (current_users) into Django's api.User model.

Usage:
  python import_users_from_mongo.py [--dry-run] [--update-existing]

Set environment variable MONGO_DB to your MongoDB connection string, or place a .env
file one level up (frontend/hykerapp/backend/.env) with MONGO_DB=... and this script will
pick it up automatically.

The script will:
 - connect to MongoDB
 - read documents from `current_users` collection
 - for each document with an email, create a Django User or update existing (if flag set)
 - passwords found will be hashed using Django's make_password unless they already look like a Django hash.
"""
import os
import sys
import argparse
from pathlib import Path

# allow running from django_backend/scripts directory
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# setup django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drbackend.settings')
try:
    import django
    django.setup()
except Exception as e:
    print('Failed to setup Django:', e)
    raise

import json
from django.contrib.auth.hashers import make_password
from api.models import User

try:
    # optional dotenv in the frontend backend folder
    from dotenv import load_dotenv
    # try to load ../backend/.env if exists
    dotenv_path = BASE_DIR.parent / 'backend' / '.env'
    if dotenv_path.exists():
        load_dotenv(dotenv_path)
except Exception:
    pass

from pymongo import MongoClient


def is_probably_django_hash(s: str) -> bool:
    if not s or not isinstance(s, str):
        return False
    # Django default hash looks like: algorithm$salt$hash or pbkdf2_sha256$...
    return s.startswith('pbkdf2_') or s.startswith('argon2') or s.startswith('bcrypt') or s.startswith('$2') or ('$' in s and s.count('$') >= 2)


def main():
    parser = argparse.ArgumentParser(description='Import users from MongoDB into Django')
    parser.add_argument('--dry-run', action='store_true', help='Run without making DB changes')
    parser.add_argument('--update-existing', action='store_true', help='Update existing Django users')
    args = parser.parse_args()

    mongo_uri = os.environ.get('MONGO_DB')
    if not mongo_uri:
        print('MONGO_DB environment variable not set. Please set it to your MongoDB URI.')
        return

    client = MongoClient(mongo_uri)
    # try to get default database from URI, otherwise use 'test'
    try:
        db = client.get_default_database()
    except Exception:
        # Fallback: use database name from URI path or ask user
        db = client.get_database()

    coll_name = 'current_users'
    if coll_name not in db.list_collection_names():
        print(f'Collection {coll_name} not found in database {db.name}. Available:', db.list_collection_names())
        return

    coll = db[coll_name]
    cursor = coll.find()

    created = 0
    updated = 0
    skipped = 0

    for doc in cursor:
        email = doc.get('email')
        if not email:
            skipped += 1
            print('Skipping doc with no email:', doc.get('_id'))
            continue

        name = doc.get('name') or doc.get('username') or ''
        password = doc.get('password') or ''

        try:
            existing = User.objects.filter(email=email).first()
            if existing:
                if args.update_existing:
                    print('Updating existing user:', email)
                    existing.name = name or existing.name
                    if password:
                        if is_probably_django_hash(password):
                            existing.password = password
                        else:
                            existing.password = make_password(password)
                    if not args.dry_run:
                        existing.save()
                    updated += 1
                else:
                    skipped += 1
                    print('User exists, skipping (use --update-existing to overwrite):', email)
                continue

            # create new user
            if is_probably_django_hash(password):
                pw = password
            else:
                pw = make_password(password) if password else ''

            print('Creating user:', email)
            if not args.dry_run:
                User.objects.create(name=name, email=email, password=pw)
            created += 1

        except Exception as e:
            print('Error processing', email, e)

    print('\nImport summary:')
    print('  created:', created)
    print('  updated:', updated)
    print('  skipped:', skipped)


if __name__ == '__main__':
    main()
