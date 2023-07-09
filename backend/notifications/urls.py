from django.urls import path
from .views import ListNotificationsView, ReadNotificationView

app_name="notifications"
urlpatterns = [
    path('', ListNotificationsView.as_view(), name='list_notifications'),
    path('<int:pk>/read/', ReadNotificationView.as_view(), name='notification-read'),
]
