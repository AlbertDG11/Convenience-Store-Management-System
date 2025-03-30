from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', views.index, name='employee_index'),
    path('list/', EmployeeView.as_view()),
    path('add/', EmployeeView.as_view())
]