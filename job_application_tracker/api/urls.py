from django.urls import path
from . import views

urlpatterns = [
    path('api/getAll/', views.getAll),
    
]