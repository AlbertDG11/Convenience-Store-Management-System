from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', AuthenticationView.as_view()),
]