from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='employee_index'),
]