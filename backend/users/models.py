from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.contrib.contenttypes.fields import GenericRelation
# from comments.models import Comment
# from django.db.models import get_model

# Create your models here.
class RestifyUser(AbstractUser):
    email = models.EmailField(max_length=255, unique=True, null=False, verbose_name="Email Address")
    # password
    username = None
    # first_name
    # last_name
    phone_number = models.CharField(max_length=255, blank=True, null=True, verbose_name="Phone number")
    avatar = models.ImageField(blank=True, null=True)
    # avatar = models.FileField(blank=True, null=True)
    comments_about_user = GenericRelation('comments.Comment', related_query_name='user')

    # rating    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    # password1 = models.CharField(max_length=255, verbose_name="Password", null=True)
    # password2 = models.CharField(max_length=255, verbose_name="Confirm Password", null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['password']
    REQUIRED_FIELDS = []

    def __str__(self):
        if self.last_name == '' and self.first_name == '':
            return self.email
        return f"{self.first_name} {self.last_name}"