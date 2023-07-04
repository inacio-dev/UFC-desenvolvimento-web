from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid
from datetime import datetime, timedelta
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório.")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    USER_TYPES = (
        ('normal', 'Normal'),
        ('empresa', 'Empresa'),
        ('admin', 'Admin'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, default='')
    password = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=USER_TYPES, default='normal')
    wallet = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='api/images/', blank=True, null=True)  # Campo para a foto de perfil
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['type']

    objects = UserManager()

    def is_logged_in(self):
        # Verifica se o usuário está logado com base na última data de login
        # e em um período de tempo definido
        last_login_threshold = timezone.now() - timedelta(minutes=30)
        return self.last_login > last_login_threshold

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    
class Image(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='api/images/')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_images')
    purchased_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='purchased_images')
    upload_date = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return self.title
