from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('sales/', SalesReportView.as_view()),
    path('purchase/', PurchaseDailyView.as_view(), name='purchase-report'),
]