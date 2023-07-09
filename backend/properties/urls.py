from django.urls import path
from .views import property

app_name = "properties"
urlpatterns = [
    path('add/', property.PropertyCreate.as_view(), name='add-property'),
    path('<int:pk>/update/', property.PropertyUpdate.as_view(), name='edit-property'),
    path('search/', property.PropertySearch.as_view(), name='property-search'),
    path('manage/', property.PropertyManage.as_view(), name='property-manager'),
    path('<int:pk>/details/', property.PropertyDetail.as_view(), name='property-detail'),
    path('<int:pk>/delete/', property.PropertyDelete.as_view(), name='delete-property'),
    path('<int:pk>/dates/create/', property.AvailableDateCreate.as_view(), name='create-datesession'),
    path('<int:pk>/dates/update/', property.AvailableDateUpdate.as_view(), name='update-datesession'),
    path('<int:pk>/dates/delete/', property.AvailableDateDelete.as_view(), name='delete-datesession')
]