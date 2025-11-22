import json
import traceback
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import User


@csrf_exempt
def signup(request):
    # Allow preflight OPTIONS
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body.decode('utf-8') or '{}')
        email = body.get('email')
        name = body.get('name', '')
        password = body.get('password', '')

        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'User already exists'}, status=409)

        pw_hash = make_password(password) if password else ''
        user = User.objects.create(name=name, email=email, password=pw_hash)
        return JsonResponse({'message': 'User created', 'user': user.to_dict()}, status=201)
    except Exception:
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)


@csrf_exempt
def login(request):
    # Allow preflight OPTIONS
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body.decode('utf-8') or '{}')
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password required'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        if not user.password:
            # oauth-only user
            return JsonResponse({'error': 'No password set for this account'}, status=401)

        if not check_password(password, user.password):
            return JsonResponse({'error': 'Invalid password'}, status=401)

        return JsonResponse({'message': 'Login successful', 'user': user.to_dict()}, status=200)
    except Exception:
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)


@csrf_exempt
def oauth_google(request):
    # Allow preflight OPTIONS
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        body = json.loads(request.body.decode('utf-8') or '{}')
        email = body.get('email')
        name = body.get('name', '')

        # For simplicity this endpoint trusts client-provided email (frontend decoded token).
        # For production verify Google's token server-side.
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)

        user, created = User.objects.get_or_create(email=email, defaults={'name': name, 'password': ''})
        if created:
            return JsonResponse({'message': 'User created', 'user': user.to_dict()}, status=201)
        else:
            return JsonResponse({'message': 'User exists', 'user': user.to_dict()}, status=200)
    except Exception:
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)


def users_list(request):
    # Allow preflight OPTIONS
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)
    # GET: return all users (without passwords)
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    try:
        qs = User.objects.all()
        data = [u.to_dict() for u in qs]
        return JsonResponse(data, safe=False)
    except Exception:
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)
