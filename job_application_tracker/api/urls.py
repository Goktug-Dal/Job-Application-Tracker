from django.urls import path
from . import views

urlpatterns = [
    path('getAll/', views.getAll),
    path('createJob/', views.createJob),
    path('editJob/<int:id>/',views.editJob),
    #path('/', views.),
]