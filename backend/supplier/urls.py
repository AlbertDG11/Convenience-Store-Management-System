from django.urls import path
from .views import SupplierViewSet

supplier_list = SupplierViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

supplier_detail = SupplierViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('suppliers/', supplier_list, name='supplier-list'),
    path('suppliers/<int:pk>/', supplier_detail, name='supplier-detail'),
]
