from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.response import Response

class NotificationsPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class ListNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationsPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user, is_read=False).order_by('-created_at')

class ReadNotificationView(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        notification_id = kwargs.get('pk')
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            if notification.is_read:
                return Response({'message': 'Notification has been read already.'})
            notification.is_read = True
            notification.save()
            return Response(self.serializer_class(notification).data)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)