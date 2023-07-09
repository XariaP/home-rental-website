from django.urls import path
from . import views
# from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name="accounts"
urlpatterns = [ 
    path('signup/', views.SignupView.as_view(), name='signup'),
    # https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('myprofile/edit/', views.EditInfoView.as_view(), name='edit-myprofile'),
    # path('profile/<int:pk>/edit/', views.EditInfoView.as_view(), name='edit-profile'),
    path('profile/<int:pk>/view/<str:type>/', views.DisplayInfoView.as_view(), name='view-profile'),
    path('myprofile/view/', views.DisplayMyInfoView.as_view(), name='view-myprofile'),
]
