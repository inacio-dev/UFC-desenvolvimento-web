from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Image
import json
from django.core.paginator import Paginator
from django.core.exceptions import ValidationError
from django.http import QueryDict

def index(request):
    if request.method == 'GET':
        images_per_page = 8
        images = Image.objects.filter(purchased_by=None).order_by('-upload_date')
        
        paginator = Paginator(images, images_per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        response_data = {
            'images': [{'imageSrc': request.build_absolute_uri(image.image.url), 'title': image.title, 'price': str(image.price)} for image in page_obj],
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

@csrf_exempt
def update_profile(request):
    if request.method == 'PATCH':
        try:
            req = json.loads(request.body)
            description = req.get("description")
            username = req.get("username")
            user_id = req.get("user")

            user = User.objects.get(id=user_id)

            if user.is_logged_in():
                user.description = description
                user.username = username
                user.save()

                return JsonResponse({'success': True, 'message': 'Profile updated successfully.'})
            else:
                return JsonResponse({'error': 'Usuário precisa estar logado.'}, status=401)
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "PATCH"
        return response

@csrf_exempt
def buy_image(request):
    if request.method == 'PATCH':
        try:
            req = json.loads(request.body)
            image_id = req.get("image")
            user_id = req.get("user")

            user = User.objects.get(id=user_id)
            image = Image.objects.get(pk=int(image_id))

            if user.is_logged_in() and image.purchased_by == None:
                if user.type == "empresa":
                    if float(user.wallet) - float(image.price) < 0:
                        return JsonResponse({'error': 'Usuário não pode retirar mais do que possui.'}, status=402)
                    else:
                        wallet = float(user.wallet) - float(image.price)
                        user.wallet = wallet
                        user.save()
                        image.purchased_by = user
                        image.save()
                else:
                    return JsonResponse({'error': 'Usuário não pode efetuar compra.'}, status=402)

                return JsonResponse({'success': True, 'message': 'Wallet updated successfully.'})
            else:
                return JsonResponse({'error': 'Usuário precisa estar logado.'}, status=401)
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "PATCH"
        return response

@csrf_exempt
def update_wallet(request):
    if request.method == 'PATCH':
        try:
            req = json.loads(request.body)
            value = req.get("value")
            user_id = req.get("user")

            user = User.objects.get(id=user_id)

            if user.is_logged_in():
                if user.type == "normal":
                    if float(user.wallet) - float(value) < 0:
                        return JsonResponse({'error': 'Usuário não pode retirar mais do que possui.'}, status=402)
                    else :
                        wallet = float(user.wallet) - float(value)
                        user.wallet = wallet
                        user.save()
                if user.type == "empresa":
                    wallet = float(user.wallet) + float(value)
                    user.wallet = wallet
                    user.save()

                return JsonResponse({'success': True, 'message': 'Wallet updated successfully.'})
            else:
                return JsonResponse({'error': 'Usuário precisa estar logado.'}, status=401)
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "PATCH"
        return response



def get_profile(request, user_id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)

            if user.type == 'normal':
                images = Image.objects.filter(user=user, purchased_by=None).order_by('-upload_date')
                description = user.description
                wallet = str(user.wallet)
                image_user = user.profile_image

                if image_user and image_user.file:
                    image_user_url = request.build_absolute_uri(image_user.url)
                else:
                    image_user_url = ""

                response_data = {
                    'name': user.username,
                    'email': user.email,
                    'type': user.type,
                    'description': description,
                    'wallet': wallet,
                    'image_user': image_user_url,
                    'images': [{'imageSrc': request.build_absolute_uri(image.image.url), 'title': image.title, 'price': str(image.price)} for image in images],
                }

                response = JsonResponse(response_data)
                response["Access-Control-Allow-Origin"] = "http://localhost:3000"
                response["Access-Control-Allow-Methods"] = "GET"
                return response
            elif user.type == 'empresa':
                images = Image.objects.filter(purchased_by=user).order_by('-upload_date')
                description = user.description
                wallet = str(user.wallet)
                image_user = user.profile_image

                if image_user and image_user.file:
                    image_user_url = request.build_absolute_uri(image_user.url)
                else:
                    image_user_url = ""

                response_data = {
                    'name': user.username,
                    'email': user.email,
                    'type': user.type,
                    'description': description,
                    'wallet': wallet,
                    'image_user': image_user_url,
                    'images': [{'imageSrc': request.build_absolute_uri(image.image.url), 'title': image.title, 'price': str(image.price)} for image in images],
                }

                response = JsonResponse(response_data)
                response["Access-Control-Allow-Origin"] = "http://localhost:3000"
                response["Access-Control-Allow-Methods"] = "GET"
                return response
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET"
        return response

def search_images(request):
    if request.method == 'GET':
        query_params = QueryDict(request.GET.urlencode())
        value = query_params.get('value')
        
        images = Image.objects.filter(title__icontains=value, purchased_by=None).order_by('-upload_date')
        
        response_data = {
            'images': [{'imageSrc': request.build_absolute_uri(image.image.url), 'title': image.title, 'price': str(image.price)} for image in images],
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
def publish_image(request):
    if request.method == 'POST':
        try:
            title = request.POST.get('title')
            price = request.POST.get('price')
            image = request.FILES.get('image')
            user_id = request.POST.get("user")

            user = User.objects.get(id=user_id)

            if user.is_logged_in():
                image = Image(title=title, price=price, image=image, user=user)
                image.save()

                return JsonResponse({'success': True, 'message': 'Image published successfully.'})
            else:
                return JsonResponse({'error': 'Usuário precisa estar logado.'}, status=401)
        except (ValidationError, ValueError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        response = JsonResponse({'error': 'Method not allowed.'}, status=405)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST"
        return response

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

