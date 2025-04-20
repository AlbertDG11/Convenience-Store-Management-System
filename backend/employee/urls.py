from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', EmployeeView.as_view()),
    path('<int:employee_id>/', EmployeeDetailView.as_view()),
    path('subordinate/<int:manager_id>/', SubordinateView.as_view())
]