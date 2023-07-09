from django.urls import path
from . import views

app_name="comments"
urlpatterns = [ 
    path('property/<int:property_id>/view/', views.ListPropertyCommentsView.as_view(), name='view-property-comments'),
    path('property/<int:property_id>/reply/<int:comment_id>/', views.ReplyPropertyCommentView.as_view(), name='reply-property-comment'),
    path('property/<int:property_id>/add/', views.AddPropertyCommentView.as_view(), name='add-property-comment'),
    path('property/<int:property_id>/delete/<int:pk>/', views.DeletePropertyCommentView.as_view(), name='del-property-comment'),

    path('user/<int:user_id>/view/', views.ListUserCommentsView.as_view(), name='view-user-comments'),
    path('user/<int:user_id>/add/', views.AddUserCommentView.as_view(), name='add-user-comment'),
    path('user/<int:user_id>/delete/<int:pk>/', views.DeleteUserCommentView.as_view(), name='del-user-comment'),
    
]
