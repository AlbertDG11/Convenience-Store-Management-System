from rest_framework.routers import DefaultRouter

from backend.purchase.views import InventoryPurchaseViewSet

router = DefaultRouter()
router.register(r'inventory_purchases', InventoryPurchaseViewSet)

urlpatterns = router.urls