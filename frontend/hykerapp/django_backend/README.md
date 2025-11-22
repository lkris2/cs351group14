Django backend for Hyker (minimal)

How to run (local development):

1. Create a virtualenv and activate it:

   python -m venv .venv
   .venv\Scripts\Activate.ps1

2. Install requirements:

   pip install -r requirements.txt

3. Run migrations and start server:

   python manage.py migrate
   python manage.py runserver 8000

The API endpoints are:
- POST /api/users/signup
- POST /api/users/login
- POST /api/users/oauth/google

Note: For production you'll want to set DEBUG=False, configure SECRET_KEY, and use a proper DB.
