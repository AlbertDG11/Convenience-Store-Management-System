from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', EmployeeView.as_view()),
    path('<int:employee_id>/', EmployeeDetailView.as_view()),
]