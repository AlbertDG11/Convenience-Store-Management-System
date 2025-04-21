from django.urls import path
from .views import ProductViewSet, InventoryViewSet, FoodProductViewSet, NonFoodProductViewSet

product_list = ProductViewSet.as_view({'get': 'list', 'post': 'create'})
product_detail = ProductViewSet.as_view({
    'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
})

foodproduct_list = FoodProductViewSet.as_view({'get': 'list', 'post': 'create'})
foodproduct_detail = FoodProductViewSet.as_view({
    'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
})

nonfoodproduct_list = NonFoodProductViewSet.as_view({'get': 'list', 'post': 'create'})
nonfoodproduct_detail = NonFoodProductViewSet.as_view({
    'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
})

inventory_list = InventoryViewSet.as_view({'get': 'list', 'post': 'create'})
inventory_detail = InventoryViewSet.as_view({
    'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
})

urlpatterns = [
    path('products/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),

#    path('foodproducts/', foodproduct_list, name='foodproduct-list'),
#    path('foodproducts/<int:pk>/', foodproduct_detail, name='foodproduct-detail'),

#    path('nonfoodproducts/', nonfoodproduct_list, name='nonfoodproduct-list'),
#    path('nonfoodproducts/<int:pk>/', nonfoodproduct_detail, name='nonfoodproduct-detail'),
    
    path('inventory/', inventory_list, name='inventory_list'),
    path('inventory/<int:pk>/', inventory_detail, name='inventory_detail'),
]
