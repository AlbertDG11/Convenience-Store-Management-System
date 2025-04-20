from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('sales/', SalesDailyView.as_view()),
]