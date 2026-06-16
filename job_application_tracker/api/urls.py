from django.urls import path
from api.views import CreateUserView
from . import views

urlpatterns = [
    path('getAll/', views.getAll),
    path('createJob/', views.createJob),
    path('editJob/<int:id>/',views.editJob),
    path('deleteJob/<int:id>/', views.deleteJob),
    path('register/', CreateUserView.as_view(), name='register'),
    #path('/', views.),
]