"""
URL configuration for convenience_store project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('employee/', include('backend.employee.urls')),
    path('login/', include('backend.authentication.urls')),
    path('api/supplier/', include('backend.supplier.urls')),
    path('api/product/', include('backend.product.urls')),
    path('api/order/', include('backend.order.urls')),
    path('api/purchase/', include('backend.purchase.urls')),
    path('api/report/', include('backend.report.urls')),
    path('api/customer/', include('backend.customer.urls')),
]
