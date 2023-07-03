from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Image
import json
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import QueryDict

def index(request):
    if request.method == 'GET':
        images_per_page = 8
        images = Image.objects.all().order_by('-upload_date')
        
        paginator = Paginator(images, images_per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        response_data = {
            'images': [{'imageSrc': 'http://localhost:8000/' + image.image.url, 'title': image.title, 'price': str(image.price)} for image in page_obj],
            'totalPages': paginator.num_pages,
            'currentPage': page_obj.number
        }

        response = JsonResponse(response_data)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET"
        return response
    else:
        response = JsonResponse({'error': 'Método não permitido.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST"
        return response

def search_images(request):
    if request.method == 'GET':
        query_params = QueryDict(request.GET.urlencode())
        value = query_params.get('value')
        
        images = Image.objects.filter(title__icontains=value)
        
        response_data = {
            'images': [{'imageSrc': 'http://localhost:8000/' + image.image.url, 'title': image.title, 'price': str(image.price)} for image in images],
        }
        
        response = JsonResponse(response_data)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET"
        return response
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET"
        return response

@csrf_exempt
@login_required
def publish_image(request):
    if request.method == 'POST':
        try:
            title = request.POST.get('title')
            price = request.POST.get('price')
            image_file = request.FILES.get('image')

            user = request.user

            Image.objects.create(title=title, price=price, image=image_file, user=user)

            return JsonResponse({'success': True, 'message': 'Image published successfully.'})
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            req = json.loads(request.body)
            email = req['email']
            password = req['password']
            type = req['type']
            
            if not email or not password or not type:
                return JsonResponse({'error': 'Todos os campos são obrigatórios.'}, status=400)
            
            try:
                user = User.objects.create_user(email=email, password=password, type=type)
                return JsonResponse({'message': 'Usuário cadastrado com sucesso!'})
            except Exception as e:
                return JsonResponse({'error': 'Erro ao cadastrar usuário: {}'.format(str(e))}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Erro ao analisar os dados JSON.'}, status=400)
    else:
        response = JsonResponse({'error': 'Método não permitido.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST"
        return response


@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            req = json.loads(request.body)
            email = req['email']
            password = req['password']

            if not email or not password:
                return JsonResponse({'error': 'Email e senha são obrigatórios.'}, status=400)

            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                response = JsonResponse({
                    'isLoggedIn': True,
                    'id': user.id,
                    'type': user.type})
                response["Access-Control-Allow-Origin"] = "http://localhost:3000"
                response["Access-Control-Allow-Methods"] = "POST"
                return response
            else:
                return JsonResponse({'error': 'Email ou senha incorretos.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Erro ao analisar os dados JSON.'}, status=400)
    else:
        response = JsonResponse({'error': 'Método não permitido.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST"
        return response

@csrf_exempt
def user_logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout realizado com sucesso!'})
    else:
        return JsonResponse({'error': 'Método não permitido.'}, status=405)

